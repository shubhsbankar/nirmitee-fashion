import {
  response,
  catchError,
  isAuthenticated,
} from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';

export async function GET(request) {
  try {
    // const auth = await isAuthenticated('admin');
    // if (!auth.isAuth) {
    //   return response(false, 403, 'Unauthorised');
    // }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get('category');
      console.log(categorySlug);
    if (!categorySlug) {
      return response(false, 400, 'Missing category');
    }

    const pipeline = [
      // 1️⃣ Find the parent category
      {
        $match: {
          deletedAt: null,
          slug: categorySlug,
        },
      },

      // 2️⃣ Join subcategories
      {
        $lookup: {
          from: 'categories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'subCategories',
        },
      },

      // 3️⃣ Return ONLY subCategories array
      {
        $project: {
          _id: 0,
          subCategories: {
            _id: 1,
            name: 1,
            slug: 1,
          },
        },
      },
    ];

    const result = await CategoryModel.aggregate(pipeline);

    if (!result.length) {
      return response(false, 404, 'Category not found.');
    }

    // 🔥 return ONLY array
    return response(true, 200, 'Subcategories found.', result[0].subCategories);

  } catch (error) {
    return catchError(error);
  }
}
