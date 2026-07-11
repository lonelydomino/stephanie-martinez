import Atmosphere from "@/components/Atmosphere";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import WhatsNew from "@/components/WhatsNew";
import Social from "@/components/Social";
import Shop from "@/components/Shop";
import Adventures from "@/components/Adventures";
import Collaborate from "@/components/Collaborate";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Atmosphere />
      <Navbar />
      <main className="relative z-10 flex flex-1 flex-col">
        <Hero />
        <About />
        <WhatsNew />
        <Social />
        <Shop />
        <Adventures />
        <Collaborate />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
