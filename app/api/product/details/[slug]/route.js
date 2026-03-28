import {
    response,
    catchError
} from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ProductModel from '@/models/product.model';
import '@/models/media.model';
import ProductVariantModel from '@/models/productVariant.model';
import ReviewModel from '@/models/review.model';

export async function GET(request, { params }) {
    try {

        await connectDB();

        const getParams = await params;
        if (!getParams) {
            return response(false, 400, 'Missing params');
        }
        const rawSlug = getParams.slug;
        const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
        const searchParams = request.nextUrl.searchParams;
        const size = searchParams.get('size');
        const color = searchParams.get('color');


        let filter = {
            deletedAt: null,

        };
        if (!slug) {
            return response(false, 400, 'Missing input field');
        }
        // Product slugs are stored lowercase; URLs may not match casing.
        filter.slug = String(slug).trim().toLowerCase();

        const data = await ProductModel
            .findOne(filter)
            .populate('media')
            .lean();
        if (!data) {
            return response(false, 404, 'Product not found.');
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

        if (!variant) {
            return response(false, 404, 'Product not found.');
        }
        const getColor = await ProductVariantModel.distinct('color', {
            product: data._id,
            deletedAt: null,
        });
        const getSize = await ProductVariantModel
            .aggregate([
                {
                    $match: {
                        product: data._id,
                        deletedAt: null,
                    }
                },
                {
                    $sort: { _id: 1 }
                },
                {
                    $group: {
                        _id: "$size",
                        first: { $first: "$_id" }
                    }
                },
                {
                    $sort: {
                        first: 1
                    }
                },
                {
                    $project: { _id: 0, size: "$_id" }
                }

            ]);

        const review = await ReviewModel.countDocuments({ product: data._id });
        const mediaMap = new Map();

        // Product images FIRST (priority)
        (data.media || []).forEach(img => {
            mediaMap.set(String(img._id), img);
        });

        // Variant images AFTER (only new ones)
        (variant.media || []).forEach(img => {
            mediaMap.set(String(img._id), img);
        });

        const mergedMedia = Array.from(mediaMap.values());

        const productData = {
            products: data,
            variant: {
                ...variant,
                media: mergedMedia
            },
            colors: getColor,
            sizes: getSize.length ? getSize.map(item => item.size) : [],
            reviewCount: review
        }
        return response(true, 200, "Product found.", productData);

    }
    catch (error) {

        return catchError(error);
    }
}
