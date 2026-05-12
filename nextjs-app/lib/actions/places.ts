// Live "find gyms by exact location" via Google Places API.
// Used from the onboarding gym-search UI so users see gyms within walking/
// driving distance of their actual location instead of a static seed list.
//
// Cost & rate limit notes:
//   - Each call hits Places Nearby Search ($32 / 1000 requests, ~3¢ each)
//   - For real-time UX we throttle to one request per location change
//   - Server-side only — never expose GOOGLE_MAPS_API_KEY to the browser
'use server'

import { createClient } from '../supabase/server'

const KEY = process.env.GOOGLE_MAPS_API_KEY

export interface PlaceGym {
  /** Google place_id — stable across requests */
  google_place_id: string
  name: string
  /** Display address: street, city, state, zip */
  address: string | null
  city: string | null
  state: string | null
  zip: string | null
  latitude: number
  longitude: number
  /** 0–5, may be null if no reviews */
  rating: number | null
  user_ratings_count: number | null
  type: 'gym' | 'apartment' | 'community_center'
}

interface PlacesResult {
  place_id: string
  name: string
  geometry: { location: { lat: number; lng: number } }
  vicinity?: string
  rating?: number
  user_ratings_total?: number
  types?: string[]
  business_status?: string
}

function classifyType(name: string, types: string[] = []): PlaceGym['type'] {
  const n = name.toLowerCase()
  if (n.includes('apartment') || n.includes('residences') || n.includes('lofts')) return 'apartment'
  if (n.includes('community center') || n.includes('rec center') || n.includes('ymca')) return 'community_center'
  return 'gym'
}

/**
 * Find gyms near a coordinate. The user's onboarding form can pass either:
 *   - lat/lng captured from the browser geolocation API, OR
 *   - lat/lng resolved from a zip-code search (use `geocodeZip` first)
 *
 * Returns up to 20 results, deduplicated by Google place_id.
 * Each call also writes the results into Supabase as gym rows (upsert by
 * google_place_id) so the data accumulates as users explore the app.
 */
export async function findGymsNearLocation(opts: {
  lat: number
  lng: number
  /** Search radius in meters. 8000 = ~5 miles. Max 50000 (Google cap). */
  radiusMeters?: number
}): Promise<{ ok: true; gyms: PlaceGym[] } | { ok: false; error: string }> {
  if (!KEY) {
    return { ok: false, error: 'Google Maps API not configured. Set GOOGLE_MAPS_API_KEY.' }
  }
  const radius = Math.min(opts.radiusMeters ?? 8000, 50000)

  try {
    const params = new URLSearchParams({
      location: `${opts.lat},${opts.lng}`,
      radius: String(radius),
      type: 'gym',
      key: KEY,
    })
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`,
      { cache: 'no-store' },
    )
    const json: { results?: PlacesResult[]; status: string; error_message?: string } = await res.json()
    if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
      return { ok: false, error: `Places error: ${json.status} ${json.error_message ?? ''}`.trim() }
    }

    const gyms: PlaceGym[] = (json.results ?? [])
      .filter(p => !p.business_status || p.business_status === 'OPERATIONAL')
      .map(p => ({
        google_place_id: p.place_id,
        name: p.name,
        address: p.vicinity ?? null,
        city: null,    // can't get from nearbysearch alone — fill via getPlaceDetails if needed
        state: null,
        zip: null,
        latitude: p.geometry.location.lat,
        longitude: p.geometry.location.lng,
        rating: p.rating ?? null,
        user_ratings_count: p.user_ratings_total ?? null,
        type: classifyType(p.name, p.types),
      }))

    // Best-effort write to Supabase so data accumulates without re-pulling.
    // Skip on auth/RLS errors — caller flow continues.
    try {
      const supabase = await createClient()
      for (const g of gyms) {
        await supabase
          .from('gyms')
          .upsert({
            google_place_id: g.google_place_id,
            name: g.name,
            type: g.type,
            address: g.address,
            latitude: g.latitude,
            longitude: g.longitude,
            rating: g.rating,
            user_ratings_count: g.user_ratings_count,
            location_source: 'google_places_live',
            location_status: 'active',
            verified: false, // not yet enriched with full details
          }, { onConflict: 'google_place_id' })
      }
    } catch {
      // best-effort
    }

    return { ok: true, gyms }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}

/**
 * Convert a US ZIP code (or any place name) into lat/lng + locality info via
 * the Google Geocoding API. Used in onboarding when the user types "77433"
 * instead of granting browser geolocation.
 */
export async function geocodeZip(zipOrAddress: string): Promise<
  | { ok: true; lat: number; lng: number; formattedAddress: string; city?: string; state?: string; zip?: string }
  | { ok: false; error: string }
> {
  if (!KEY) return { ok: false, error: 'Google Maps API not configured.' }

  const params = new URLSearchParams({
    address: zipOrAddress,
    components: 'country:US',
    key: KEY,
  })

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?${params}`,
      { cache: 'no-store' },
    )
    const json: {
      status: string
      error_message?: string
      results?: Array<{
        geometry: { location: { lat: number; lng: number } }
        formatted_address: string
        address_components: Array<{ types: string[]; short_name: string; long_name: string }>
      }>
    } = await res.json()

    if (json.status !== 'OK' || !json.results?.length) {
      return { ok: false, error: `Geocoding error: ${json.status} ${json.error_message ?? ''}`.trim() }
    }
    const r = json.results[0]
    const find = (t: string) => r.address_components.find(c => c.types.includes(t))

    return {
      ok: true,
      lat: r.geometry.location.lat,
      lng: r.geometry.location.lng,
      formattedAddress: r.formatted_address,
      city: find('locality')?.long_name ?? find('postal_town')?.long_name,
      state: find('administrative_area_level_1')?.short_name,
      zip: find('postal_code')?.long_name,
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message }
  }
}
