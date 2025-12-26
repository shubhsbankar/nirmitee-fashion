'use client'
import { OTPSchema } from '@/lib/zodSchema';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/application/ButtonLoading'
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useState } from 'react';
import axios from 'axios';
import { showToast } from '@/lib/showToast';

const OTPVerification = ({email, onSubmit, loading}) => {
    const [isResendingOtp, setIsResendingOtp] = useState(false);
const form = useForm({
       resolver: zodResolver(OTPSchema),
       defaultValues: {
       otp: "",
       email: email
       }
     });
  const handleOtpVerification = async (values) => {
       onSubmit(values);
       
  }

  const resentOtp = async () => {
    setIsResendingOtp(true);
	try {
		const {data : response } = await axios.post('/api/auth/resend-otp', 
                                                    { email });
		if ( !response.success ){
			throw new Error(response.message);
		}
		console.log(response.message)
        showToast('success',response.message);
	}
	catch (error) {
		console.log(error.message)
        showToast('error',error.message);
	}
	finally{
		setIsResendingOtp(false);
	}

  }


  return (
     <div>
	 <div className="text-center">
	 	<h1 className="text-2xl font-bold mb-2">Please complete verification</h1>
		<p className="text-md">We have sent an One-time Password (OTP) to your registered email address. 
		The OTP is valid for 10 minutes only.</p>
	 </div>
     <Form {...form}>
			 <form onSubmit={form.handleSubmit(handleOtpVerification)} >
             <div className='mb-5 mt-5 flex justify-center'>
				  <FormField
					control={form.control}
					name="otp"
					render={({ field }) => (
					  <FormItem>
						<FormLabel className="font-semibold">One-time Password (OTP)</FormLabel>
						<FormControl>
                        	<InputOTP maxLength={6} pattern={REGEXP_ONLY_DIGITS_AND_CHARS} {...field}>
      							<InputOTPGroup>
        							<InputOTPSlot index={0} className="text-xl size-10" />
        							<InputOTPSlot index={1} className="text-xl size-10" />
        							<InputOTPSlot index={2} className="text-xl size-10" />
        							<InputOTPSlot index={3} className="text-xl size-10" />
        							<InputOTPSlot index={4} className="text-xl size-10" />
        							<InputOTPSlot index={5} className="text-xl size-10" />
      							</InputOTPGroup>
    					</InputOTP>
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>
               <div className='mb-3'>
                 <ButtonLoading type="submit" text="Verify" loading={loading} className={"w-full cursor-pointer"}/>
				 <div className="text-center mt-5">
                   {!isResendingOtp? <button onClick={resentOtp} type="button" className="text-blue-500 cursor-pointer hover:underline">Resend OTP</button>
                   : <span className="text-sm">Resending OTP...</span>
                   }
				 </div>
               </div>
    
			</form>
			</Form></div>
  )
}

export default OTPVerification;
