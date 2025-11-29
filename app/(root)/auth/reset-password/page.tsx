'use client'
import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/public/assets/images/NFLogo.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { loginSchema, LoginInput } from '@/lib/zodSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ButtonLoading from '@/components/application/ButtonLoading';
import UpdatePassword from '@/components/application/UpdatePassword';
import { useState } from 'react';
import  Link  from 'next/link';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import OTPVerification from '@/components/application/OTPVerification';

const ResetPassword = () => {
  const [ loading, setLoading] = useState<boolean>(false);
  const [ otpVerificationLoading, setOtpVerificationLoading] = useState<boolean>(false);
  const [otpEmail, setOtpEmail] = useState();
  const [isOtpVerified, setIsOtpVerified] = useState(false);


  const formSchema = loginSchema.pick({
    email: true,
    });
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email : "",
    },
  });

  const handleFormSubmit = async (values : LoginInput) => {
    console.log(values);
    setLoading(true);
	try {
		const {data : sendOtpResponse } = await axios.post('/api/auth/reset-password/send-otp',values);
		if ( !sendOtpResponse.success ){
			throw new Error(sendOtpResponse.message);
		}
		form.reset();
		console.log(sendOtpResponse.message)
        showToast('success',sendOtpResponse.message);
        setOtpEmail(values.email);
	}
	catch (error) {
		console.log(error.message)
        showToast('error',error.message);
	}
	finally{
		setLoading(false);
	}
  }
  const handleOtpVerification = async (values) => {
    console.log(values);
    setOtpVerificationLoading(true);
	try {
		const {data : response } = await axios.post('/api/auth/reset-password/verify-otp',values);
		if ( !response.success ){
			throw new Error(response.message);
		}
		console.log(response.message)
        showToast('success',response.message);
        setIsOtpVerified(true);
	}
	catch (error) {
		console.log(error.message)
        showToast('error',error.message);
	}
	finally{
		setOtpVerificationLoading(false);
	}
  }

    return  <Card className="w-[400px]"> 
        <CardContent>
            <div className="flex justify-center">
                <Image src= { Logo.src} width={ 100 } height={ 100 } alt="logo" className="max-w-[150px]"/>
            </div>
          { !otpEmail ?
              <> 
            <div className="text-center">
                <h1 className="font-bold text-3xl">Reset Password</h1>
                <p>Enter your email for password reset.</p>
            </div>
			<div className='mt-5'>
			 <Form {...form}>
			 <form onSubmit={form.handleSubmit(handleFormSubmit)} >
             <div className='mb-5'>
				  <FormField
					control={form.control}
					name="email"
					render={({ field }) => (
					  <FormItem>
						<FormLabel>Email</FormLabel>
						<FormControl>
						  <Input type="email" placeholder="example@gmail.com" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>

               <div className='mb-3'>
                 <ButtonLoading type="submit" text="Send OTP" loading={loading} className={"w-full cursor-pointer"}/>
               </div>
               <div className='text-center'>
                 <div className="flex justify-center items-center gap-1">
                   <Link href={WEBSITE_LOGIN} className='text-primary underline'>Back To Login</Link>
                 </div>

               </div>
			</form>
			</Form>
            </div> 
            </>
            : <>
            { !isOtpVerified ? 
              <OTPVerification email={otpEmail} 
			onSubmit={handleOtpVerification} 
			loading={otpVerificationLoading}/>
            :<UpdatePassword email={otpEmail}/>}
            </>
          }
        </CardContent>
    </Card>
}

export default ResetPassword;
