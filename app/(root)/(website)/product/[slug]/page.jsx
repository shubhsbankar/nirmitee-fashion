import axios from "axios";
import ProductDetails from "./ProductDetails";

const ProductPage = async ({ params, searchParams }) => {
    const { slug: rawSlug } = await params;
    const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
    const sp = await searchParams;
    const size = typeof sp?.size === "string" ? sp.size : Array.isArray(sp?.size) ? sp.size[0] : undefined;
    const color = typeof sp?.color === "string" ? sp.color : Array.isArray(sp?.color) ? sp.color[0] : undefined;

    const base = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!base) {
        return (
            <div className="flex justify-center items-center py-10 h-[300px]">
                <h1 className="text-4xl font-semibold">Server configuration error.</h1>
            </div>
        );
    }

    const pathSlug = encodeURIComponent(String(slug ?? "").trim());
    let url = `${base.replace(/\/$/, "")}/product/details/${pathSlug}`;

    const qs = new URLSearchParams();
    if (color) qs.set("color", color);
    if (size) qs.set("size", size);
    const q = qs.toString();
    if (q) url += `?${q}`;

    let getProduct;
    try {
        const res = await axios.get(url);
        getProduct = res.data;
    } catch {
        return (
            <div className="flex justify-center items-center py-10 h-[300px]">
                <h1 className="text-4xl font-semibold">Unable to load product.</h1>
            </div>
        );
    }

    if (!getProduct?.success) {
        return (
            <div className="flex justify-center items-center py-10 h-[300px]">
                <h1 className="text-4xl font-semibold">Data not found.</h1>
            </div>
        )
    }

  return (
      <ProductDetails
          product={getProduct?.data?.products}
          variant={getProduct?.data?.variant}
          colors={getProduct?.data?.colors}
          sizes={getProduct?.data?.sizes}
          reviewCount={getProduct?.data?.reviewCount}
      />
  )
}

export default ProductPage 
