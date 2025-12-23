'use client'
import ButtonLoading from "@/components/application/ButtonLoading"
import UserPanelLayout from "@/components/application/website/UserPanelLayout"
import WebsiteBreadCrumb from "@/components/application/website/WebsiteBreadCrumb"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import useFetch from "@/hooks/useFetch"
import { profileSchema } from "@/lib/zodSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Dropzone from 'react-dropzone'
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import userIcon from '@/public/assets/images/user.png';
import { FaCamera } from "react-icons/fa"
import { showToast } from "@/lib/showToast"
import axios from "axios"
import { useDispatch } from "react-redux"
import { login } from "@/store/reducer/authReducer"


const breadCrumb = {
  title: 'Profile',
  links: [
    { label: "Profile" }
  ]
}

const Profile = () => {
  const { data: user } = useFetch('/api/profile/get');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [file, setFile] = useState('');
  const dispatch = useDispatch();

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      address: '',
      phone: ''
    },
  });

  useEffect(() => {
    if (user && user.success) {
      const userData = user.data;
      form.reset({
        fullName: userData?.fullName,
        phone: userData?.phone,
        address: userData?.address,
      });
      setPreview(userData?.avatar?.url)
    }
  }, [user]);

  const updateProfile = async (values) => {
    setLoading(true);
    try {
      let formData = new FormData();
      if (file) {
        formData.set('file', file);
      }
      formData.set('fullName', values.fullName);
      formData.set('phone', values.phone);
      formData.set('address', values.address);
      const { data: response } = await axios.put('/api/profile/update', formData);
      if (!response.success) {
        throw new Error(response.message);
      }
      showToast('success', response.message);
      dispatch(login(response.data));
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setLoading(false);
    }

  }
  const handleFileSelection = (files) => {
    const file = files[0];
    const preview = URL.createObjectURL(file);
    setPreview(preview);
    setFile(file);
  }
  return (
    <div>
      <WebsiteBreadCrumb props={breadCrumb} />
      <UserPanelLayout>
        <div className="shadow rounded">
          <div className="p-5 text-xl font-semibold border-b">
            Profile
          </div>
          <div className="p-5">
            <Form {...form}>
              <form className='grid md:grid-cols-2 grid-cols-1 gap-5' onSubmit={form.handleSubmit(updateProfile)} >
                <div className="md:col-span-2 col-span-1 flex justify-center items-center">
                  <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                    {({ getRootProps, getInputProps }) => (
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Avatar className="w-28 h-28 relative group border border-gray-100">
                          <AvatarImage src={preview ? preview : userIcon.src} />
                          <div className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center border-2
                          border-violet-500 rounded-full group-hover:flex hidden cursor-pointer bg-black/20">
                            <FaCamera color='#7c3aed' />
                          </div>
                        </Avatar>
                      </div>
                    )}
                  </Dropzone>
                </div>
                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="Full Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-3'>
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className='mb-3 md:col-span-2 col-span-1'>
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className='mb-3 md:col-span-2 col-span-1'>
                  <ButtonLoading type="submit" text="Update Profile" loading={loading} className={"cursor-pointer"} />
                </div>
              </form>
            </Form>
          </div>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default Profile
