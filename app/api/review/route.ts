import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import ReviewModel from '@/models/review.model';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
         const auth = await isAuthenticated('admin');
         if (!auth.isAuth){
             return response(false, 403, 'Unauthorised');
         }
         await connectDB();
         const searchParams = request.nextUrl.searchParams;
         console.log('searchParams',searchParams); 

         const start = parseInt(searchParams.get('start') || 0,10); 
         const size = parseInt(searchParams.get('size') || 10,10); 
         const filters = JSON.parse(searchParams.get('filters') || "[]"); 
         const globalFilter = searchParams.get('globalFilters') || ''; 
         const sorting = JSON.parse(searchParams.get('sorting') || "[]"); 
         const deleteType = searchParams.get('deleteType');
         
         let matchQuery = {};

         if (deleteType === 'SD'){
             matchQuery = {deletedAt: null};
         }else if(deleteType === 'PD'){
             matchQuery = { deletedAt: {$ne: null}};
         }

         if (globalFilter) {
             matchQuery['$or']= [
                 {'productData.name': { $regex: globalFilter, $options: 'i'}},
                 {'userData.fullName': { $regex: globalFilter, $options: 'i'}},
                 {rating: { $regex: globalFilter, $options: 'i'}},
                 {review: { $regex: globalFilter, $options: 'i'}},
             ]
         }

         filters.forEach(filter => {
            if (filter.id === 'product'){
                matchQuery['productData.name'] = { $regex: filter.value, $options: 'i'};

            } else if(filter.id === 'user'){
                 matchQuery['userData.fullName'] = { $regex: filter.value, $options: 'i'};
            }else{
                matchQuery[filter.id] = { $regex: filter.value, $options: 'i'};
            }
         });

         let sortQuery= {};
         sorting.forEach(sort =>{
             sortQuery[sort.id] = sort.desc ? -1 : 1;
         });

         const aggregatePipeline = [
            {
                $lookup: {
                    from: 'products',
                    localField: 'product',
                    foreignField: '_id',
                    as: 'productData'
                }
            },
            {
                $unwind:{
                    path: '$productData', 
                    preserveNullAndEmptyArrays: true
                }
            },
                   {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'userData'
                }
            },
            {
                $unwind:{
                    path: '$userData', 
                    preserveNullAndEmptyArrays: true
                }
            },
             {$match : matchQuery},
             {$sort: Object.keys(sortQuery).length ? sortQuery : {createdAt: -1}},
             {$skip: start},
             {$limit: size},
             {
                 $project: {
                     _id: 1,
                     product: '$productData.name',
                     user: '$userData.fullName',
                     rating: 1,
                     review: 1,
                     title: 1,
                     createdAt: 1,
                     updatedAt: 1,
                     deletedAt: 1
                 }
             }
         ]

         const getReview = await ReviewModel.aggregate(aggregatePipeline);

         const totalRowCount = await ReviewModel.countDocuments(matchQuery);


         console.log('totalRowCount',totalRowCount); 


        return NextResponse.json({
            success:true,
            data: getReview,
            meta: { totalRowCount }
        });

    }
    catch (error) {

        return catchError(error);
    }
}






