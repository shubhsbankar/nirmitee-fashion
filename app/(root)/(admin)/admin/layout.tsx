import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from '@/components/application/admin/AppSidebar';

const layout = ({ children }) => {
    return (
        <SidebarProvider>
            <AppSidebar />
        <main>{children} </main>
        </SidebarProvider>
    );
};

export default layout;
