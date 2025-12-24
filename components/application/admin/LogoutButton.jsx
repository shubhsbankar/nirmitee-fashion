import { AiOutlineLogout } from "react-icons/ai";
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { showToast } from '@/lib/showToast';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/reducer/authReducer';
import { WEBSITE_LOGIN } from '@/routes/WebsiteRoute';
import { useRouter } from 'next/navigation';

const LogoutButton = () =>{
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = async () =>{
    try {

      const { data : logoutResponse } = await axios.post('/api/auth/logout');
      if ( !logoutResponse.success ) {
        throw new Error(logoutResponse.message);
      }

      dispatch(logout());
      showToast('success',logoutResponse.message);
      router.push(WEBSITE_LOGIN);
    }catch (error){
      showToast('error',error.message);
    }
  };

    return (
      <DropdownMenuItem  onClick={handleLogout} className='cursor-pointer'>
         <AiOutlineLogout color='red'/>
         Logout
	   </DropdownMenuItem> 
    );
};

export default LogoutButton;
