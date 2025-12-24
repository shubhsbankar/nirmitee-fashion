import Footer from "@/components/application/website/Footer";
import Header from "@/components/application/website/Header";
import { Kumbh_Sans } from "next/font/google";

const kumbh = Kumbh_Sans({ subsets: ["latin"], weight: ["400", "500", "600","700","800"] , display: "swap" });

const layout = ({ children }) => {
    return (
        <div className={kumbh.className}>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export default layout;
