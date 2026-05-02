// /app/merch — gear shop. Mirrors the Replit Merch page.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { MerchClient, type Product } from './MerchClient'

export const metadata = { title: 'Workout Partna Gear', robots: { index: false, follow: false } }

export default async function MerchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const { data: products } = await supabase
    .from('merch_products')
    .select('id, name, description, category, price, image, sizes, colors, in_stock, featured')
    .eq('in_stock', true)
    .order('featured', { ascending: false })
    .order('created_at', { ascending: true })

  return <MerchClient products={(products ?? []) as Product[]} />
}
