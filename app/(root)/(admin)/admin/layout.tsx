import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from '@/components/application/admin/AppSidebar';
import Topbar from '@/components/application/admin/Topbar';
import ThemeProvider from '@/components/application/admin/ThemeProvider';

const layout = ({ children }) => {
    return (
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
        <SidebarProvider>
            <AppSidebar />
            <main className='md:w-[calc(100vw-16rem)]'>
                <div className='pt-[70px] px-8 min-h-[calc(100vh-40px)] pb-10'>
                    <Topbar />
                    {children} 
                </div>
                <div className='border-t h-[40px] flex justify-center items-center bg-gray-500
                    dark:bg-background text-sm'>
                    © 2025 Nirmitee Fashion. All rights reserved.
                </div>
        </main>
        </SidebarProvider>
        </ThemeProvider>
    );
};

export default layout;
