import { response, 
         catchError, 
         isAuthenticated } from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import CouponModel from '@/models/coupon.model';
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
                 {code: { $regex: globalFilter, $options: 'i'}},
                 {
                    $expr:{
                        $regexMatch:{
                            input: { $toString: "$minShoppingAmount"},
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                 },
                 {
                    $expr:{
                        $regexMatch:{
                            input: { $toString: "$discountPercentage"},
                            regex: globalFilter,
                            options: 'i'
                        }
                    }
                 }
             ]
         }

         filters.forEach(filter => {
            if (filter.id === 'minShoppingAmount' || filter.id === 'discountPercentage'){
                matchQuery[filter.id] = Number(filter.value);

            }else if(filter.id === 'validity'){
                matchQuery[filter.id] = new Date(filter.value);
            }
            else {
             matchQuery[filter.id] = { $regex: filter.value, $options: 'i'};
            }
         });

         let sortQuery= {};
         sorting.forEach(sort =>{
             sortQuery[sort.id] = sort.desc ? -1 : 1;
         });

         const aggregatePipeline = [
             {$match : matchQuery},
             {$sort: Object.keys(sortQuery).length ? sortQuery : {createdAt: -1}},
             {$skip: start},
             {$limit: size},
             {
                 $project: {
                     _id: 1,
                     code: 1,
                     discountPercentage: 1,
                     minShoppingAmount: 1,
                     validity: 1,
                     createdAt: 1,
                     updatedAt: 1,
                     deletedAt: 1
                 }
             }
         ]

         const getcoupon = await CouponModel.aggregate(aggregatePipeline);

         const totalRowCount = await CouponModel.countDocuments(matchQuery);


         console.log('totalRowCount',totalRowCount); 


        return NextResponse.json({
            success:true,
            data: getcoupon,
            meta: { totalRowCount }
        });

    }
    catch (error) {

        return catchError(error);
    }
}






