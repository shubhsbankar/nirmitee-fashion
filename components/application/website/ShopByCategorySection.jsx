import axios from 'axios'
import Link from 'next/link'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { WEBSITE_SHOP } from '@/routes/WebsiteRoute'

const ShopByCategorySection = async () => {
  let categories = []
  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/category/get-category`
    )
    if (data?.success && Array.isArray(data?.data)) {
      categories = data.data
    }
  } catch {
    return null
  }

  if (!categories.length) return null

  return (
    <section className="lg:px-32 px-4 sm:py-14 py-8 bg-muted/40">
      <div className="flex justify-between items-center mb-8 gap-4 flex-wrap">
        <div>
          <h2 className="sm:text-4xl text-2xl font-semibold">Shop by category</h2>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
            Browse our collections and find styles that suit you.
          </p>
        </div>
        <Link
          href={WEBSITE_SHOP}
          className="flex items-center gap-2 underline underline-offset-4 hover:text-primary shrink-0"
        >
          View all products
          <IoIosArrowRoundForward />
        </Link>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat._id}
            href={`${WEBSITE_SHOP}?category=${encodeURIComponent(cat.slug)}`}
            className="group rounded-lg border bg-background p-6 shadow-sm transition-all hover:border-primary hover:shadow-md"
          >
            <span className="font-medium text-lg group-hover:text-primary">{cat.name}</span>
            <span className="mt-2 flex items-center gap-1 text-sm text-muted-foreground group-hover:text-primary">
              Explore
              <IoIosArrowRoundForward className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ShopByCategorySection
