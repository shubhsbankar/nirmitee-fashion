'use client'
import { Card, CardContent } from '@/components/ui/card'
import Logo from '@/public/assets/images/NFLogo.png'
import Image from 'next/image'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { signupSchema, SignupInput } from '@/lib/zodSchema'
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
import  Link  from 'next/link';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute'
import axios from 'axios'

const RegisterPage = () => {
  const [ loading, setLoading] = useState<boolean>(false);
  const [ isPasswordType, setIsPasswordType] = useState<boolean>(true);

  const form = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
       fullName: "",
      email : "",
      password : "",
      confirmPassword: ""
    },
  });

  const handleFormSubmit = async (values : SignupInput) => {
    console.log(values);
    setLoading(true);
	try {
		const {data : registerResponse } = await axios.post('/api/auth/register',values);
		if ( !registerResponse.success ){
			throw new Error(registerResponse.message);
		}
		form.reset();
		console.log(registerResponse.message)
		alert(registerResponse.message)
	}
	catch (error) {
		console.log(error.message)
		alert(error.message)
	}
	finally{
		setLoading(false);
	}
  }
    return  <Card className="w-[400px]"> 
        <CardContent>
            <div className="flex justify-center">
                <Image src= { Logo.src} width={ 100 } height={ 100 } alt="logo" className="max-w-[150px]"/>
            </div>
            <div className="text-center">
                <h1 className="font-bold text-3xl">Create Account</h1>
                <p>Create new account by filling out the form below.</p>
            </div>
			<div className='mt-5'>
			 <Form {...form}>
			 <form onSubmit={form.handleSubmit(handleFormSubmit)} >
               
                <div className='mb-5'>
				  <FormField
					control={form.control}
					name="fullName"
					render={({ field }) => (
					  <FormItem>
						<FormLabel>Full Name</FormLabel>
						<FormControl>
						  <Input type="text" placeholder="Shubham Bankar" {...field} />
						</FormControl>
						<FormMessage />
					  </FormItem>
					)}
				  />
            </div>
             
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

				 {/*      <div className='mb-5'>
				  <FormField
					control={form.control}
					name="confirmPassword"
					render={({ field }) => (
					  <FormItem className='relative'>
						<FormLabel>Confirm Password</FormLabel>
						<FormControl>
                          <Input type={isPasswordType ? "password" : "text"} placeholder="*********" {...field} />
						</FormControl>
                          <button type='button' className="absolute top-1/2 right-2 cursor-pointer" onClick={() => setIsPasswordType(!isPasswordType)}>
                            { isPasswordType ? <FaRegEyeSlash /> : < FaRegEye /> } 
                          </button>
						<FormMessage />
					  </FormItem>
					)}
				  />
				  </div>*/}

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
                 <ButtonLoading type="submit" text="Create Account" loading={loading} className={"w-full cursor-pointer"}/>
               </div>
               <div className='text-center'>
                 <div className="flex justify-center items-center gap-1">
                   <p>Already have account?</p>
                   <Link href={WEBSITE_LOGIN} className='text-primary underline'>Login account</Link>
                 </div>
               </div>
			</form>
			</Form>
			</div>
        </CardContent>
    </Card>
}

export default RegisterPage;
