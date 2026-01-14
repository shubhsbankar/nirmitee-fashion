// import {
//     response,
//     catchError,
//     isAuthenticated
// } from '@/lib/helperFunctions';
// import connectDB from '@/lib/dbConnect';
// import CategoryModel from '@/models/category.model';
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//     try {
//         const auth = await isAuthenticated('admin');
//         if (!auth.isAuth) {
//             return response(false, 403, 'Unauthorised');
//         }
//         await connectDB();
//         const searchParams = request.nextUrl.searchParams;
//         console.log('searchParams', searchParams);

//         const start = parseInt(searchParams.get('start') || 0, 10);
//         const size = parseInt(searchParams.get('size') || 10, 10);
//         const filters = JSON.parse(searchParams.get('filters') || "[]");
//         const globalFilter = searchParams.get('globalFilters') || '';
//         const sorting = JSON.parse(searchParams.get('sorting') || "[]");
//         const deleteType = searchParams.get('deleteType');
//         const isSubcategory = searchParams.get('isSubCategory') || false;
//         const isCategory = searchParams.get('isCategory') || false;
//         console.log('isCategory', isCategory)
//         let matchQuery = {};

//         if (deleteType === 'SD') {
//             matchQuery = { deletedAt: null };
//         } else if (deleteType === 'PD') {
//             matchQuery = { deletedAt: { $ne: null } };
//         }

//         if (globalFilter) {
//             matchQuery['$or'] = [
//                 { name: { $regex: globalFilter, $options: 'i' } },
//                 { slug: { $regex: globalFilter, $options: 'i' } },
//             ]
//         }

//         filters.forEach(filter => {
//             matchQuery[filter.id] = { $regex: filter.value, $options: 'i' }
//         });

//         let sortQuery = {};
//         sorting.forEach(sort => {
//             sortQuery[sort.id] = sort.desc ? -1 : 1;
//         });
//         let project = null;
//         if (isCategory) {
//             project = {
//                 _id: 1,
//                 name: 1,
//                 slug: 1,
//                 subCategories: {
//                     _id: 1,
//                     name: 1,
//                     slug: 1,
//                 },
//                 createdAt: 1,
//                 updatedAt: 1,
//                 deletedAt: 1
//             };

//         } else {
//             project = {
//                 _id: 1,
//                 name: 1,
//                 slug: 1,
//                 subCategories: 1,
//                 createdAt: 1,
//                 updatedAt: 1,
//                 deletedAt: 1
//             };
//         }

//         const aggregatePipeline = [
//             { $match: matchQuery },
//             {
//                 $lookup: isCategory ? {
//                     from: 'categories',
//                     localField: 'subCategories',
//                     foreignField: '_id',
//                     as: 'subCategories',
//                 } : null,
//             },
//             { $sort: Object.keys(sortQuery).length ? sortQuery : { createdAt: -1 } },
//             { $skip: start },
//             { $limit: size },

//             {
//                 $project: project
//             }
//         ]

//         let getCategory = await CategoryModel.aggregate(aggregatePipeline);

//         if (isSubcategory) {
//             getCategory = getCategory.filter(cat => cat.subCategories.length === 0);
//         }

//         if (isCategory) {
//             getCategory = getCategory.filter(cat => cat.subCategories.length !== 0)
//         }

//         const totalRowCount = await CategoryModel.countDocuments(matchQuery);


//         console.log('totalRowCount', totalRowCount);


//         return NextResponse.json({
//             success: true,
//             data: getCategory,
//             meta: { totalRowCount }
//         });

//     }
//     catch (error) {

//         return catchError(error);
//     }
// }

import {
  response,
  catchError,
  isAuthenticated
} from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CategoryModel from '@/models/category.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // ---------------- AUTH ----------------
    const auth = await isAuthenticated('admin');
    if (!auth.isAuth) {
      return response(false, 403, 'Unauthorised');
    }

    await connectDB();

    // ---------------- PARAMS ----------------
    const searchParams = request.nextUrl.searchParams;

    const start = parseInt(searchParams.get('start') || '0', 10);
    const size = parseInt(searchParams.get('size') || '10', 10);

    // Safe JSON parsing
    let filters = [];
    let sorting = [];

    try {
      filters = JSON.parse(searchParams.get('filters') || '[]');
    } catch {
      filters = [];
    }

    try {
      sorting = JSON.parse(searchParams.get('sorting') || '[]');
    } catch {
      sorting = [];
    }

    const globalFilter = searchParams.get('globalFilters') || '';
    const deleteType = searchParams.get('deleteType');

    // Booleans come as strings from query params
    const isSubcategory = searchParams.get('isSubCategory') === 'true';
    const isCategory = searchParams.get('isCategory') === 'true';

    // ---------------- MATCH QUERY ----------------
    let matchQuery = {};

    if (deleteType === 'SD') {
      matchQuery = { deletedAt: null };
    } else if (deleteType === 'PD') {
      matchQuery = { deletedAt: { $ne: null } };
    }

    if (globalFilter) {
      matchQuery.$or = [
        { name: { $regex: globalFilter, $options: 'i' } },
        { slug: { $regex: globalFilter, $options: 'i' } },
      ];
    }

    if (Array.isArray(filters)) {
      filters.forEach(filter => {
        if (filter?.id && filter?.value) {
          matchQuery[filter.id] = {
            $regex: filter.value,
            $options: 'i',
          };
        }
      });
    }

    // ---------------- SORT QUERY ----------------
    let sortQuery = {};

    if (Array.isArray(sorting)) {
      sorting.forEach(sort => {
        if (sort?.id) {
          sortQuery[sort.id] = sort.desc ? -1 : 1;
        }
      });
    }

    // ---------------- PROJECT ----------------
    let project;

    if (isCategory) {
      project = {
        _id: 1,
        name: 1,
        slug: 1,
        subCategories: {
          _id: 1,
          name: 1,
          slug: 1,
        },
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      };
    } else {
      project = {
        _id: 1,
        name: 1,
        slug: 1,
        subCategories: 1,
        createdAt: 1,
        updatedAt: 1,
        deletedAt: 1,
      };
    }

    // ---------------- AGGREGATION PIPELINE ----------------
    const aggregatePipeline = [
      { $match: matchQuery },
    ];

    // Add lookup ONLY when required (never push null)
    if (isCategory) {
      aggregatePipeline.push({
        $lookup: {
          from: 'categories',
          localField: 'subCategories',
          foreignField: '_id',
          as: 'subCategories',
        },
      });
    }

    aggregatePipeline.push(
      {
        $sort: Object.keys(sortQuery || {}).length
          ? sortQuery
          : { createdAt: -1 },
      },
      { $skip: start },
      { $limit: size },
      { $project: project }
    );

    // ---------------- QUERY ----------------
    let getCategory = await CategoryModel.aggregate(aggregatePipeline);

    // ---------------- POST FILTERING ----------------
    if (isSubcategory) {
      getCategory = getCategory.filter(
        cat => !cat.subCategories || cat.subCategories.length === 0
      );
    }

    if (isCategory) {
      getCategory = getCategory.filter(
        cat => cat.subCategories && cat.subCategories.length !== 0
      );
    }

    const totalRowCount = await CategoryModel.countDocuments(matchQuery);

    // ---------------- RESPONSE ----------------
    return NextResponse.json({
      success: true,
      data: getCategory,
      meta: { totalRowCount },
    });

  } catch (error) {
    return catchError(error);
  }
}
