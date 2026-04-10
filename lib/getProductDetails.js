import connectDB from '@/lib/dbConnect';
import ProductModel from '@/models/product.model';
import '@/models/media.model';
import ProductVariantModel from '@/models/productVariant.model';
import ReviewModel from '@/models/review.model';

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Loads product + variant data for the product detail page and API route.
 * Keeps one code path so SSR does not depend on NEXT_PUBLIC_API_BASE_URL or self-HTTP.
 */
export async function getProductDetailsBySlug({ slug, size, color }) {
  if (!slug) {
    return { ok: false, status: 400, message: 'Missing input field' };
  }

  await connectDB();

  const normalizedSlug = String(slug).trim().toLowerCase();

  let data = await ProductModel.findOne({
    deletedAt: null,
    slug: normalizedSlug,
  })
    .populate('media')
    .lean();

  if (!data) {
    data = await ProductModel.findOne({
      deletedAt: null,
      slug: { $regex: new RegExp(`^${escapeRegex(normalizedSlug)}$`, 'i') },
    })
      .populate('media')
      .lean();
  }

  if (!data) {
    return { ok: false, status: 404, message: 'Product not found.' };
  }


  const variantBase = { product: data._id, deletedAt: null };

  let variant = null;

  if (size && color) {
    variant = await ProductVariantModel.findOne({
      ...variantBase,
      size,
      color,
    })
      .populate('media')
      .lean();
  } else if (size) {
    variant = await ProductVariantModel.findOne({
      ...variantBase,
      size,
    })
      .populate('media')
      .lean();
  } else if (color) {
    variant = await ProductVariantModel.findOne({
      ...variantBase,
      color,
    })
      .populate('media')
      .lean();
  }

  if (!variant) {
    variant = await ProductVariantModel.findOne(variantBase)
      .sort({ _id: 1 })
      .populate('media')
      .lean();
  }

  if (!variant) {
    variant = await ProductVariantModel.findOne({ product: data._id })
      .sort({ _id: 1 })
      .populate('media')
      .lean();
  }

  // if (!variant) {
  //   return { ok: false, status: 404, message: 'Product not found Shubham.' };
  // }

  const getColor = await ProductVariantModel.distinct('color', {
    product: data._id,
    deletedAt: null,
  });

  const getSize = await ProductVariantModel.aggregate([
    {
      $match: {
        product: data._id,
        deletedAt: null,
      },
    },
    { $sort: { _id: 1 } },
    {
      $group: {
        _id: '$size',
        first: { $first: '$_id' },
      },
    },
    { $sort: { first: 1 } },
    { $project: { _id: 0, size: '$_id' } },
  ]);

  const review = await ReviewModel.countDocuments({ product: data._id });
  const mediaMap = new Map();

  (data.media || []).forEach((img) => {
    mediaMap.set(String(img._id), img);
  });

  (variant.media || []).forEach((img) => {
    mediaMap.set(String(img._id), img);
  });

  const mergedMedia = Array.from(mediaMap.values());

  const productData = {
    products: data,
    variant: {
      ...variant,
      media: mergedMedia,
    },
    colors: getColor,
    sizes: getSize.length ? getSize.map((item) => item.size) : [],
    reviewCount: review,
  };

  return { ok: true, data: productData };
}
