'use client'

import { useParams, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import ProductDetails from './ProductDetails'

export default function ProductPageClient() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params?.slug
  const queryString = searchParams.toString()
  const [state, setState] = useState({
    loading: true,
    data: null,
    errorMessage: null,
  })

  useEffect(() => {
    const raw = Array.isArray(slug) ? slug[0] : slug
    if (!raw) {
      setState({ loading: false, data: null, errorMessage: 'Missing product link.' })
      return
    }

    const incoming = new URLSearchParams(queryString)
    const size = incoming.get('size') || undefined
    const color = incoming.get('color') || undefined

    let url = `/api/product/details/${encodeURIComponent(String(raw).trim())}`
    const out = new URLSearchParams()
    if (size) out.set('size', size)
    if (color) out.set('color', color)
    if (out.toString()) url += `?${out}`

    let cancelled = false
    setState((s) => ({ ...s, loading: true, errorMessage: null }))

    fetch(url, { cache: 'no-store', credentials: 'same-origin' })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}))
        if (cancelled) return
        if (!body?.success) {
          setState({
            loading: false,
            data: null,
            errorMessage: body?.message || 'Product not found.',
          })
          return
        }
        setState({ loading: false, data: body.data, errorMessage: null })
      })
      .catch((err) => {
        if (cancelled) return
        setState({
          loading: false,
          data: null,
          errorMessage: err?.message || 'Request failed.',
        })
      })

    return () => {
      cancelled = true
    }
  }, [slug, queryString])

  if (state.loading) {
    return (
      <div className="flex justify-center items-center py-20 min-h-[280px]">
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!state.data) {
    return (
      <div className="flex flex-col justify-center items-center py-10 min-h-[300px] px-4 text-center gap-3">
        <h1 className="text-2xl sm:text-4xl font-semibold">Data not found.</h1>
        {state.errorMessage ? (
          <p className="text-sm text-muted-foreground max-w-md">{state.errorMessage}</p>
        ) : null}
      </div>
    )
  }

  const d = state.data
  return (
    <ProductDetails
      product={d.products}
      variant={d.variant}
      colors={d.colors}
      sizes={d.sizes}
      reviewCount={d.reviewCount}
    />
  )
}
