import { response, 
         catchError
} from '@/lib/helperFunctions';
import connectDB from '@/lib/dbConnect';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
         await connectDB();
         const cookieStore = await cookies();
         cookieStore.delete('access_token');

         return response(true,200,"Logout successfully.");

    }
    catch (error) {
        return catchError(error);
    }
}
