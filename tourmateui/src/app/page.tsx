import ContactText from "@/components/contact-text";
import Footer from "@/components/footer";
import HeroSection from "@/components/hero-section";
import MegaMenu from "@/components/mega-menu";

export default function Home() {
  return (
    <>
      <MegaMenu />
      <HeroSection/>
      <ContactText />
      <Footer />
    </>
  );
}
