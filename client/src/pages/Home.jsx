import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import NoticeBoard from "../components/NoticeBoard";
import Gallery from "../components/Gallery";
import WhyChooseUs from "../components/WhyChooseUs";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <NoticeBoard />
      <Gallery />
      <WhyChooseUs />
      <Stats />
      <Testimonials />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;
