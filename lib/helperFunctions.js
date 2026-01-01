/*import { NextResponse } from 'next/server';
export function response (success, statusCode, message, data = {}){
        return NextResponse.json({
          success,
          statusCode,
          message,
          data
        });
}

export const catchError = (error, customMessage) => {
  // handling duplicate key error

  if (error.code === 11000){
    const keys = Object.keys(error.keyPattern).join(',');
    error.message = `Duplicate fields: ${keys}. These fields value must be unique.`;
  }

  let errorObj = {};

  if (process.env.NODE_ENV === 'development') {
    errorObj = {
      message : error.message,
      error
    }
  }
  else {

    errorObj = {
      message : customMessage || 'Internal server error.',
    }
  }
  return response(false, error.code, ...errorObj);
};*/

import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from 'jose';
import { sendMail } from '@/lib/sendMail'
import { emailVerificationLink }  from '@/email/emailVerification'
import { cookies } from 'next/headers';

export function response(success, statusCode, message, data = {}) {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  });
}

export const catchError = (error, customMessage) => {
  console.error(error);
  // handling duplicate key error (Mongo 11000)
  if (error?.code === 11000) {
    const keys = Object.keys(error.keyPattern || {}).join(", ");
    error.message = `Duplicate fields: ${keys}. These field values must be unique.`;
  }

  const statusCode = typeof error?.code === "number" ? error.code : 500;

  // Build a consistent error payload
  const errorPayload = process.env.NODE_ENV === "development"
    ? {
        message: error?.message ?? String(error),
        // include the raw error for developers (be cautious in production)
        error,
      }
    : {
        message: customMessage ?? "Internal server error.",
      };

  // Pass message as a string and data as an object (no spreading)
  return response(false, statusCode, errorPayload.message, process.env.NODE_ENV === "development" ? { error: errorPayload.error } : {});
};

export const sendEmailVerificationLink = async (id,email) => {
                const secret = new TextEncoder().encode(process.env.SECRET_KEY);

        const token = await new  SignJWT ( {userId: id.toString()} )
                            .setIssuedAt()
                            .setExpirationTime('1h')
                            .setProtectedHeader({alg: 'HS256'})
                            .sign(secret);

        await sendMail('Email verification request from Nirmitee Fashion',email,
                       emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`));
}

export const generateOtp = () => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  return otp;
}

export const isAuthenticated = async (role) => {
  try {
    const cookieStore = await cookies();
    if (!cookieStore.has('access_token')){
      return {
        isAuth : false
      }
    }
    const access_token = cookieStore.get('access_token');
    const { payload } = await jwtVerify(access_token.value,
                                        new TextEncoder().encode(process.env.SECRET_KEY));

    if (payload.role !== role) {
      return {
        isAuth : false
      }
    }
    return {
      isAuth: true,
      userId: payload._id
    }
  }
  catch (error) {
    return {
      isAuth: false,
      error
    }
  }
};


export const columnConfig = (column, isCreatedAt=false, 
                             isUpdatedAt=false, isDeletedAt=false)=> {
      const newColumn = [...column]

      if(isCreatedAt) {
        newColumn.push({
          accessorKey: 'createdAt',
          header: 'Created At',
          Cell:({renderedCellValue})=>(new Date(renderedCellValue)
                                      .toLocaleString())
        })
      }

        if(isUpdatedAt) {
        newColumn.push({
          accessorKey: 'updatedAt',
          header: 'Updated At',
          Cell:({renderedCellValue})=>(new Date(renderedCellValue)
                                      .toLocaleString())
        })
        }

        if(isDeletedAt) {
        newColumn.push({
          accessorKey: 'deletedAt',
          header: 'Deleted At',
          Cell:({renderedCellValue})=>(new Date(renderedCellValue)
                                      .toLocaleString())
        })
      }

      return newColumn;
}
