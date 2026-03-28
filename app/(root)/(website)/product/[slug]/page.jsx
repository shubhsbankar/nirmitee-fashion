import { Suspense } from 'react'
import ProductPageClient from './ProductPageClient'

/**
 * Product data is loaded in the browser via fetch(`/api/product/details/...`) so that:
 * - DevTools → Network shows the API call (RSC-only DB access does not appear as XHR/fetch).
 * - Same-origin `/api` always matches the site you are testing (no NEXT_PUBLIC_API_BASE_URL mismatch).
 */
export default function ProductPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20 min-h-[280px]">
          <p className="text-lg text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <ProductPageClient />
    </Suspense>
  )
}
