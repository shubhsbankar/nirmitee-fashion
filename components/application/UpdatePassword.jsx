'use client'
import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/public/assets/images/NFLogo.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { resetPasswordSchema } from '@/lib/zodSchema'
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
import { useState } from 'react';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import axios from 'axios';
import { showToast } from '@/lib/showToast';
import { useRouter } from 'next/navigation';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';

const UpdatePassword = ({ email }) => {
  const [ loading, setLoading] = useState<boolean>(false);
  const [ isPasswordType, setIsPasswordType] = useState<boolean>(true);
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email,
      password : "",
      confirmPassword: ""
    },
  });

  const handleFormSubmit = async (values ) => {
    console.log(values);
    setLoading(true);
	try {
		const {data : passwordUpdate } = await axios.put('/api/auth/reset-password/update-password',values);
		if ( !passwordUpdate.success ){
			throw new Error(passwordUpdate.message);
		}
		form.reset();
		console.log(passwordUpdate.message)
        showToast('success',passwordUpdate.message);
        router.push(WEBSITE_LOGIN);
	}
	catch (error) {
		console.log(error.message)
        showToast('error',error.message);
	}
	finally{
		setLoading(false);
	}
  }
    return  ( 
        <div>
            <div className="flex justify-center">
                <Image src= { Logo.src} width={ 100 } height={ 100 } alt="logo" className="max-w-[150px]"/>
            </div>
            <div className="text-center">
                <h1 className="font-bold text-3xl">Update Password</h1>
                <p>Create new password by filling out the form below.</p>
            </div>
			<div className='mt-5'>
			 <Form {...form}>
			 <form onSubmit={form.handleSubmit(handleFormSubmit)} >
             

            <div className='mb-5'>
				  <FormField
					control={form.control}
					name="password"
					render={({ field }) => (
					  <FormItem className='relative'>
						<FormLabel>Password</FormLabel>
						<FormControl>
                          <Input type="password" placeholder="*********" {...field} />
						</FormControl>
					<FormMessage />
					  </FormItem>
					)}
				  />
            </div>

            <div className="mb-5">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>

                    {/* WRAPPER: only input + icon inside this relatively positioned box */}
                    <div className="relative">
                      <FormControl>
                        <Input
                          type={isPasswordType ? "password" : "text"}
                          placeholder="*********"
                          {...field}
                          className="pr-10" // ensure space for the icon
                        />
                      </FormControl>

                      {/* Icon button vertically centered inside the input area */}
                      <button
                        type="button"
                        onClick={() => setIsPasswordType(!isPasswordType)}
                        className="absolute inset-y-0 right-2 flex items-center justify-center px-2"
                        aria-label={isPasswordType ? "Show password" : "Hide password"}
                      >
                        {isPasswordType ? <FaRegEyeSlash className="h-5 w-5" /> : <FaRegEye className="h-5 w-5" />}
                      </button>
                    </div>

                    {/* Put the error message OUTSIDE the relative wrapper so it won't affect icon centering */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

               <div className='mb-3'>
                 <ButtonLoading type="submit" text="Update Password" loading={loading} className={"w-full cursor-pointer"}/>
               </div>

			</form>
			</Form>
			</div>
        </div>
          )
}


export default UpdatePassword;
