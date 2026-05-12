// Seed the gyms table from Google Places API (Nearby Search → Places Details).
//
// Usage:
//   GOOGLE_MAPS_API_KEY=AIza... \
//   SUPABASE_URL=https://qpbjxetwgfcugturwnji.supabase.co \
//   SUPABASE_SERVICE_ROLE_KEY=eyJ... \
//   npx tsx scripts/seed-gyms-from-google-places.ts
//
//   Optional flags via env:
//     GYM_SEED_LAT=29.9577        # Center latitude (default = Cypress, TX 77433)
//     GYM_SEED_LNG=-95.6979       # Center longitude
//     GYM_SEED_RADIUS_M=24000     # Radius in meters (default 24km ≈ 15 miles)
//     GYM_SEED_REPLACE=true       # Wipe non-claimed/non-user-created rows first
//     GYM_SEED_DRY_RUN=true       # Print what would happen without writing
//
// Required Google APIs (enable in Cloud Console):
//   - Places API (legacy or new — script uses the legacy /maps/api/place endpoints)
//
// Pricing note:
//   Places Nearby Search: $32 per 1000 requests, BUT each search returns 20 results.
//   With pagination (3 pages) you can pull up to 60 places per radius search.
//   For Cypress 77433 area we expect 30–50 actual gyms — well under one search's worth.

import { createClient } from '@supabase/supabase-js'

const KEY = process.env.GOOGLE_MAPS_API_KEY
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SR = process.env.SUPABASE_SERVICE_ROLE_KEY

const LAT = parseFloat(process.env.GYM_SEED_LAT ?? '29.9577')      // Cypress, TX 77433
const LNG = parseFloat(process.env.GYM_SEED_LNG ?? '-95.6979')
const RADIUS_M = parseInt(process.env.GYM_SEED_RADIUS_M ?? '24000') // 15 miles default
const REPLACE = process.env.GYM_SEED_REPLACE === 'true'
const DRY_RUN = process.env.GYM_SEED_DRY_RUN === 'true'

if (!KEY) {
  console.error('❌ GOOGLE_MAPS_API_KEY not set.\n' +
    '   Get one at https://console.cloud.google.com/apis/credentials\n' +
    '   Make sure the Places API is enabled for the project.')
  process.exit(1)
}
if (!SUPABASE_URL || !SUPABASE_SR) {
  console.error('❌ SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SR, { auth: { persistSession: false } })

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

interface PlaceDetails {
  formatted_address?: string
  formatted_phone_number?: string
  international_phone_number?: string
  website?: string
  address_components?: Array<{ types: string[]; short_name: string; long_name: string }>
}

async function nearbySearch(): Promise<PlacesResult[]> {
  const all: PlacesResult[] = []
  let pageToken: string | undefined

  // Up to 3 pages = 60 results max.
  for (let i = 0; i < 3; i++) {
    const params = new URLSearchParams({
      location: `${LAT},${LNG}`,
      radius: String(RADIUS_M),
      type: 'gym',
      key: KEY,
    })
    if (pageToken) params.set('pagetoken', pageToken)

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?${params}`
    if (pageToken) {
      // Google requires a brief delay before pagetoken becomes valid
      await new Promise(r => setTimeout(r, 2000))
    }
    const res = await fetch(url)
    const json: { results?: PlacesResult[]; next_page_token?: string; status: string; error_message?: string } = await res.json()
    if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
      throw new Error(`Places nearbysearch error: ${json.status} ${json.error_message ?? ''}`)
    }
    if (json.results) all.push(...json.results)
    pageToken = json.next_page_token
    if (!pageToken) break
  }
  return all
}

async function getDetails(placeId: string): Promise<PlaceDetails | null> {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'formatted_address,formatted_phone_number,international_phone_number,website,address_components',
    key: KEY,
  })
  const url = `https://maps.googleapis.com/maps/api/place/details/json?${params}`
  const res = await fetch(url)
  const json: { result?: PlaceDetails; status: string } = await res.json()
  if (json.status !== 'OK') return null
  return json.result ?? null
}

function parseAddressComponents(components: PlaceDetails['address_components']): { city?: string; state?: string; zip?: string } {
  if (!components) return {}
  const find = (t: string) => components.find(c => c.types.includes(t))
  return {
    city: find('locality')?.long_name ?? find('postal_town')?.long_name,
    state: find('administrative_area_level_1')?.short_name,
    zip: find('postal_code')?.long_name,
  }
}

function classifyType(name: string, types: string[] = []): 'gym' | 'apartment' | 'community_center' {
  const n = name.toLowerCase()
  if (n.includes('apartment') || n.includes('residences') || n.includes('lofts') || types.includes('lodging')) {
    return 'apartment'
  }
  if (n.includes('community center') || n.includes('rec center') || n.includes('ymca')) {
    return 'community_center'
  }
  return 'gym'
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════════')
  console.log('  Google Places → Supabase gyms seeder')
  console.log('═══════════════════════════════════════════════════════════════════')
  console.log(`  Center:   ${LAT}, ${LNG}  (Cypress, TX 77433 by default)`)
  console.log(`  Radius:   ${RADIUS_M} m  (~${(RADIUS_M / 1609).toFixed(1)} miles)`)
  console.log(`  Replace:  ${REPLACE ? 'YES (will wipe non-claimed gyms first)' : 'no (upsert only)'}`)
  console.log(`  Dry run:  ${DRY_RUN ? 'YES (will not write)' : 'no'}`)
  console.log()

  console.log('🔎 Calling Google Places nearbysearch (type=gym)…')
  const places = await nearbySearch()
  console.log(`   Got ${places.length} candidate places.`)

  if (REPLACE && !DRY_RUN) {
    console.log('🗑  Wiping existing gyms (skipping claimed + user-created rows)…')
    const { error } = await supabase
      .from('gyms')
      .delete()
      .is('claim_email', null)
      .is('created_by_user_id', null)
    if (error) throw new Error(`Wipe failed: ${error.message}`)
  }

  let upsertedCount = 0
  for (const p of places) {
    if (p.business_status && p.business_status !== 'OPERATIONAL') {
      console.log(`   ⏭  skipping (${p.business_status}): ${p.name}`)
      continue
    }
    const details = await getDetails(p.place_id)
    const addr = parseAddressComponents(details?.address_components)

    const row = {
      google_place_id: p.place_id,
      name: p.name,
      type: classifyType(p.name, p.types),
      address: details?.formatted_address ?? p.vicinity ?? null,
      city: addr.city ?? null,
      state: addr.state ?? null,
      zip: addr.zip ?? null,
      latitude: p.geometry.location.lat,
      longitude: p.geometry.location.lng,
      rating: p.rating ?? null,
      user_ratings_count: p.user_ratings_total ?? null,
      phone: details?.formatted_phone_number ?? details?.international_phone_number ?? null,
      website: details?.website ?? null,
      place_types: p.types ?? null,
      location_source: 'google_places',
      location_status: 'active',
      verified: true,
    }

    console.log(`   ✓ ${row.name}  ·  ${row.city ?? '?'}, ${row.state ?? '?'} ${row.zip ?? ''}  ·  ⭐ ${row.rating ?? 'n/a'} (${row.user_ratings_count ?? 0})`)

    if (!DRY_RUN) {
      const { error } = await supabase
        .from('gyms')
        .upsert(row, { onConflict: 'google_place_id' })
      if (error) {
        console.warn(`     ⚠  upsert failed: ${error.message}`)
        continue
      }
      upsertedCount++
    }
  }

  console.log()
  console.log('═══════════════════════════════════════════════════════════════════')
  if (DRY_RUN) {
    console.log(`✅ Dry run complete. Would have upserted ${places.length} gym(s).`)
  } else {
    console.log(`✅ Done. Upserted ${upsertedCount}/${places.length} gym(s).`)
  }
  console.log('═══════════════════════════════════════════════════════════════════')
}

main().catch(err => {
  console.error('❌ Seeder failed:', err)
  process.exit(1)
})
