'use client'
import { use,useEffect, useState }  from 'react';
import axios from 'axios';
import { Card, CardContent  } from '@/components/ui/card';
import { Spinner  } from '@/components/ui/spinner';
import { Badge  } from '@/components/ui/badge';
import { Button  } from '@/components/ui/button';
import verifiedImg from '@/public/assets/images/verified.gif';
import verificationFailedImg from '@/public/assets/images/verification-failed.gif';
import Link from 'next/link';
import { WEBSITE_HOME } from '@/routes/WebsiteRoute'
import Image from 'next/image'

const EmailVerification = ( { params }) => {
  const { token } = use(params);
  const [isVerified, setIsVerified]=  useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      const {data : verificationResponse } = await axios.post('/api/auth/verify-email'
      ,{ token });
     console.log("Got verification response",verificationResponse);
    if (verificationResponse.success){
      setIsVerified(true);
    }else {
      setIsVerified(false);
    }
    
    }
    verify();
  }, [token]); 

  return (
  <Card className='w-[400px]'>
        <CardContent>
          {
		    isVerified === null && 
			<div className="flex items-center gap-4 [--radius:1.2rem]" >
			   <Badge>
			       <Spinner className="size-8"/>
                 <p className="text-xl font-semibold">Verifying Email</p>
			    </Badge>
			</div> 
          }
            { isVerified === true &&
            <div>
              <div className='flex justify-center items-center'>
                <Image src={verifiedImg.src} height={verifiedImg.height} 
                       width={verifiedImg.width} alt="verification success" className="h-[100px] w-auto"/>
              </div>
              <div className='text-center'>
                <h1 className='text-2xl font-bold my-5 text-green-500'>Email verification success!</h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue shopping</Link>
                </Button>
              </div>
            </div> }
          { isVerified === false &&
              <div>
              <div className='flex justify-center items-center'>
                <Image src={verificationFailedImg.src} height={verificationFailedImg.height}
                width={verificationFailedImg.width} alt="verification failed" className="h-[100px] w-auto" />
              </div>
              <div className='text-center'>
                <h1 className='text-2xl font-bold my-5 text-red-500'>Email verification failed!</h1>
                <Button asChild>
                  <Link href={WEBSITE_HOME}>Continue shopping</Link>
                </Button>
              </div>
            </div>
          }
        </CardContent>     
  </Card>);
};

export default EmailVerification;
 


