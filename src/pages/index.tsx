import NavigationBar from "@/components/index/navigation_bar";
import Header from "@/components/index/header";
import AboutUs from "@/components/index/about_us";
import WhyUs from "@/components/index/why_us";
import OurTeam from "@/components/index/our_team";
import Interested from "@/components/index/interested";
import Footer from "@/components/index/footer";

function Index() {

    return (
        <div className="page landing">
            <NavigationBar/>
            <Header/>
            <AboutUs/>
            <WhyUs/>
            <OurTeam/>
            <Interested/>
            <Footer/>
        </div>
    );
}


export default Index
