import connectDb from  "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
    await connectDb();
    return NextResponse.json({
        success: true,
        message: "Connection Successfull"
    });
}
