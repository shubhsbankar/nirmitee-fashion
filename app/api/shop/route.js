// import {
//     response,
//     catchError,
// } from '@/lib/helperFunctions';
// import connectDB from '@/lib/dbConnect';
// import CategoryModel from '@/models/category.model'
// import ProductModel from '@/models/product.model'


// export async function GET(request) {
//     try {

//         await connectDB();

//         const searchParams = request.nextUrl.searchParams;

//         const size = searchParams.get('size');
//         const color = searchParams.get('color');
//         const categorySlug = searchParams.get('category');
//         const minPrice = parseInt(searchParams.get('minPrice')) || 0;
//         const maxPrice = parseInt(searchParams.get('maxPrice')) || 100000;

//         const search = searchParams.get('q');

//         const limit = parseInt(searchParams.get('limit')) || 9;
//         const page = parseInt(searchParams.get('page')) || 0;
//         const skip = limit * page;

//         const sortOption = searchParams.get('sort') || 'default_sorting';

//         let sortQuery = {};

//         if (sortOption === 'default_sorting') sortQuery = { createdAt: -1 };
//         if (sortOption === 'asc') sortQuery = { name: 1 };
//         if (sortOption === 'desc') sortQuery = { name: -1 };
//         if (sortOption === 'price_high_low') sortQuery = { sellingPrice: -1 };
//         if (sortOption === 'price_low_high') sortQuery = { sellingPrice: 1 };
//         let categoryId = [];
//         if (categorySlug) {
//             const slugs = categorySlug.split(',');
//             const categoryData = await CategoryModel.find({ deletedAt: null, slug: { $in: slugs } }).select('_id').lean();
//             if (categoryData) categoryId = categoryData.map(category => category._id);
//         }

//         let matchStage = {};
//         if (categoryId.length > 0) matchStage.category = { $in: categoryId };
//         if (search) {
//             matchStage.name = { $regex: search, $options: 'i' };
//         }
//         //matchStage.sellingPrice = { $gte: minPrice, $lte: maxPrice };


//         const products = await ProductModel.aggregate([
//             {
//                 $match: matchStage
//             },
//             {
//                 $sort: sortQuery
//             },
//             {
//                 $skip: skip
//             },
//             {
//                 $limit: limit + 1
//             },
//             {
//                 $lookup: {
//                     from: 'productvariants',
//                     localField: '_id',
//                     foreignField: 'product',
//                     as: 'variants'
//                 }
//             },
//             {
//                 $addFields: {
//                     variants: {
//                         $filter: {
//                             input: '$variants',
//                             as: 'variant',
//                             cond: {
//                                 $and:[
//                                     size ? { $in: ['$$variant.size', size.split(',')] } : { $literal: true },
//                                     color ? { $in: ['$$variant.color', color.split(',')] } : { $literal: true },
//                                     { $gte: ['$$variant.sellingPrice', minPrice] },
//                                     {$lte: ['$$variant.sellingPrice', maxPrice]}
//                                 ]

//                             }
//                         }
//                     }
//                 }
//             },
//             {
//                 $match: {
//                     variants: {$ne : []}
//                 }
//             },
//             {
//                 $lookup: {
//                     from: 'medias',
//                     localField: 'media',
//                     foreignField: '_id',
//                     as: 'media'
//                 }
//             },
//             {
//                 $project: {
//                     _id: 1,
//                     name: 1,
//                     slug: 1,
//                     mrp: 1,
//                     sellingPrice: 1,
//                     discountPercentage: 1,
//                     media: {
//                         _id: 1,
//                         secure_url: 1,
//                         alt: 1
//                     },
//                     variants: {
//                         color: 1,
//                         size: 1,
//                         mrp: 1,
//                         sellingPrice: 1,
//                         discountPercentage: 1,
//                     }
//                 }
//             }
//         ])



//         let nextPage = null;
//         if (products.length > limit) {
//             nextPage = page + 1;
//             products.pop();
//         }

//         return response(true, 200, "Products data found.", { products, nextPage });

//     }
//     catch (error) {

//         return catchError(error);
//     }
// }
import {
  response,
  catchError,
} from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';
import ProductModel from '@/models/product.model';

export async function GET(request) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;

    // ---------------- PARAMS ----------------
    const size = searchParams.get('size');
    const color = searchParams.get('color');
    const categorySlug = searchParams.get('category');

    const minPrice = parseInt(searchParams.get('minPrice') || '0', 10);
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000', 10);

    const search = searchParams.get('q');

    const limit = parseInt(searchParams.get('limit') || '9', 10);
    const page = parseInt(searchParams.get('page') || '0', 10);
    const skip = limit * page;

    const sortOption = searchParams.get('sort') || 'default_sorting';

    // ---------------- SORT ----------------
    let sortQuery = { createdAt: -1 }; // default

    switch (sortOption) {
      case 'asc':
        sortQuery = { name: 1 };
        break;
      case 'desc':
        sortQuery = { name: -1 };
        break;
      case 'price_high_low':
        sortQuery = { sellingPrice: -1 };
        break;
      case 'price_low_high':
        sortQuery = { sellingPrice: 1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    // ---------------- CATEGORY FILTER ----------------
    let categoryId = [];

    if (categorySlug) {
      const slugs = categorySlug.split(',');
      const categoryData = await CategoryModel
        .find({ deletedAt: null, slug: { $in: slugs } })
        .select('_id')
        .lean();

      if (Array.isArray(categoryData) && categoryData.length) {
        categoryId = categoryData.map(c => c._id);
      }
    }

    // ---------------- MATCH STAGE ----------------
    const matchStage = {};

    if (categoryId.length > 0) {
      matchStage.category = { $in: categoryId };
    }

    if (search) {
      matchStage.name = { $regex: search, $options: 'i' };
    }

    // ---------------- AGG PIPELINE ----------------
    const pipeline = [
      { $match: matchStage },

      { $sort: sortQuery },

      { $skip: skip },

      { $limit: limit + 1 },

      // --------- VARIANTS LOOKUP ----------
      {
        $lookup: {
          from: 'productvariants',
          localField: '_id',
          foreignField: 'product',
          as: 'variants',
        },
      },

      // --------- VARIANT FILTER ----------
      {
        $addFields: {
          variants: {
            $filter: {
              input: '$variants',
              as: 'variant',
              cond: {
                $and: [
                  // Size filter
                  size
                    ? { $in: ['$$variant.size', size.split(',')] }
                    : { $literal: true },

                  // Color filter
                  color
                    ? { $in: ['$$variant.color', color.split(',')] }
                    : { $literal: true },

                  // Price range
                  { $gte: ['$$variant.sellingPrice', minPrice] },
                  { $lte: ['$$variant.sellingPrice', maxPrice] },
                ],
              },
            },
          },
        },
      },

      // Remove products without valid variants
      // {
      //   $match: {
      //     variants: { $ne: [] },
      //   },
      // },

      // --------- MEDIA LOOKUP ----------
      {
        $lookup: {
          from: 'medias',
          localField: 'media',
          foreignField: '_id',
          as: 'media',
        },
      },

      // --------- PROJECT ----------
      {
        $project: {
          _id: 1,
          name: 1,
          slug: 1,
          mrp: 1,
          sellingPrice: 1,
          discountPercentage: 1,

          media: {
            _id: 1,
            secure_url: 1,
            alt: 1,
          },

          variants: {
            color: 1,
            size: 1,
            mrp: 1,
            sellingPrice: 1,
            discountPercentage: 1,
          },
        },
      },
    ];

    // ---------------- QUERY ----------------
    const products = await ProductModel.aggregate(pipeline);

    // ---------------- PAGINATION ----------------
    let nextPage = null;

    if (products.length > limit) {
      nextPage = page + 1;
      products.pop(); // remove extra record
    }

    // ---------------- RESPONSE ----------------
    return response(true, 200, 'Products data found.', {
      products,
      nextPage,
    });

  } catch (error) {
    return catchError(error);
  }
}
