// /app/merch — gear shop, synced live from the connected Printful store.
// Catalog is cached 5 min (see lib/printful/client). Checkout: Stripe payment
// → webhook creates a draft Printful order for manual confirmation.
import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import { getMerchCatalog } from '../../../../lib/printful/client'
import { MerchClient } from './MerchClient'

export const metadata = { title: 'Workout Partna Gear', robots: { index: false, follow: false } }

export default async function MerchPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/app/auth')

  const products = await getMerchCatalog()

  return <MerchClient products={products} />
}
