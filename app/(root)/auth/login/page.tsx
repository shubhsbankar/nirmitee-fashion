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
import ButtonLoading from '@/components/application/ButtonLoading'
import { useState } from 'react';
import { FaRegEyeSlash } from "react-icons/fa";
import { FaRegEye } from "react-icons/fa6";
import  Link  from 'next/link';
import { WEBSITE_REGISTER } from '@/routes/WebsiteRoute'


const LoginPage = () => {
  const [ loading, setLoading] = useState<boolean>(false);
  const [ isPasswordType, setIsPasswordType] = useState<boolean>(true);
  const formSchema = loginSchema.pick({
    email: true,
    password: true
  });
  const form = useForm<LoginInput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email : "",
      password : ""
    },
  });

  const handleFormSubmit = (values : LoginInput) => {
    console.log(values);
    setLoading(true);
  }
    return  <Card className="w-[400px]"> 
        <CardContent>
            <div className="flex justify-center">
                <Image src= { Logo.src} width={ 100 } height={ 100 } alt="logo" className="max-w-[150px]"/>
            </div>
            <div className="text-center">
                <h1 className="font-bold text-3xl">Login Into Account</h1>
                <p>Login into your account by filling out the form below.</p>
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
            <div className='mb-5'>
				  <FormField
					control={form.control}
					name="password"
					render={({ field }) => (
					  <FormItem className='relative'>
						<FormLabel>Password</FormLabel>
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
            </div>
               <div className='mb-3'>
                 <ButtonLoading type="submit" text="Login" loading={loading} className={"w-full cursor-pointer"}/>
               </div>
               <div className='text-center'>
                 <div className="flex justify-center items-center gap-1">
                   <p>Don't have account?</p>
                   <Link href={WEBSITE_REGISTER} className='text-primary underline'>Create account</Link>
                 </div>
                 <div className='mt-3'>
                   <Link href='' className='text-primary underline'>Forgot password?</Link>
                 </div>
               </div>
			</form>
			</Form>
			</div>
        </CardContent>
    </Card>
}

export default LoginPage;
