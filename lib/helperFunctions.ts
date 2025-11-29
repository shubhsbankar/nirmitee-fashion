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

export function response(success: boolean, statusCode: number, message: string, data: any = {}) {
  return NextResponse.json({
    success,
    statusCode,
    message,
    data,
  });
}

export const catchError = (error: any, customMessage?: string) => {
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

