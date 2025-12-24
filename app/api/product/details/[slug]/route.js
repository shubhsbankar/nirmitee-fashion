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
        console.log('getParams : ', getParams);
        if (!getParams) {
            return response(false, 400, 'Missing params');
        }
        const slug = getParams.slug;
        const searchParams = request.nextUrl.searchParams;
        const size = searchParams.get('size');
        const color = searchParams.get('color');


        let filter = {
            deletedAt: null,

        };
        if (!slug) {
            return response(false, 400, 'Missing input field');
        }
        filter.slug = slug;

        const data = await ProductModel
            .findOne(filter)
            .populate('media', 'secure_url')
            .lean();
        if (!data) {
            return response(false, 404, 'Product not found.');
        }
        console.log('******************', data);

        let variantFilter = {
            product: data._id
        }

        if (size) {
            variantFilter.size = size;
        }
        if (color) {
            variantFilter.color = color;
        }
        const variant = await ProductVariantModel
            .findOne(variantFilter)
            .populate('media', 'secure_url')
            .lean();
        if (!variant) {
            return response(false, 404, 'Product not found.');
        }
        const getColor = await ProductVariantModel.distinct('color', { product: data._id });
        const getSize = await ProductVariantModel
            .aggregate([
                {
                    $match: {
                        product: data._id
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
        console.log(productData);
        return response(true, 200, "Product found.", productData);

    }
    catch (error) {

        return catchError(error);
    }
}
