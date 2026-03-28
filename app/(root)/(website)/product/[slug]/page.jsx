import ProductDetails from './ProductDetails';
import { getProductDetailsBySlug } from '@/lib/getProductDetails';

const ProductPage = async ({ params, searchParams }) => {
  const { slug: rawSlug } = await params;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const sp = await searchParams;
  const size =
    typeof sp?.size === 'string'
      ? sp.size
      : Array.isArray(sp?.size)
        ? sp.size[0]
        : undefined;
  const color =
    typeof sp?.color === 'string'
      ? sp.color
      : Array.isArray(sp?.color)
        ? sp.color[0]
        : undefined;

  const result = await getProductDetailsBySlug({ slug, size, color });

  if (!result.ok) {
    return (
      <div className="flex justify-center items-center py-10 h-[300px]">
        <h1 className="text-4xl font-semibold">Data not found.</h1>
      </div>
    );
  }

  const d = result.data;

  return (
    <ProductDetails
      product={d.products}
      variant={d.variant}
      colors={d.colors}
      sizes={d.sizes}
      reviewCount={d.reviewCount}
    />
  );
};

export default ProductPage;
