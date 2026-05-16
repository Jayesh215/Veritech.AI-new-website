import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import Trust from "../components/landing/Trust";
import About from "../components/landing/About";
import Services from "../components/landing/Services";
import Industries from "../components/landing/Industries";
import Projects from "../components/landing/Projects";
import WhyUs from "../components/landing/WhyUs";
import Process from "../components/landing/Process";
import TechStack from "../components/landing/TechStack";
import Testimonials from "../components/landing/Testimonials";
import Careers from "../components/landing/Careers";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import { useVisitTracker } from "../hooks/useVisitTracker";

export default function Landing() {
  useVisitTracker("/");
  return (
    <main data-testid="landing-page" className="relative">
      <Navbar />
      <Hero />
      <Trust />
      <About />
      <Services />
      <Industries />
      <Projects />
      <WhyUs />
      <Process />
      <TechStack />
      <Testimonials />
      <Careers />
      <Contact />
      <Footer />
    </main>
  );
}
