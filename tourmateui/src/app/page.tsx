import ContactPagination from "@/components/contact-panigation";
import ContactText from "@/components/contact-text";
import FeedbackSection from "@/components/feedback-section";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import HomeActiveAreas from "@/components/home-active-areas";
import MegaMenu from "@/components/mega-menu";
import RotatingTourGuideHomePage from "@/components/rotating-tour-guide-home-page";

export default function Home() {
  return (
    <>
      <MegaMenu />
      <HeroSection/>
      <ContactText />
      <RotatingTourGuideHomePage />
      <FeedbackSection />
      <ContactPagination />
      <HomeActiveAreas />
      
      <Footer />
    </>
  );
}
