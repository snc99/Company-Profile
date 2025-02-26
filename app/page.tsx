// app/page.tsx
import Navbar from "../components/landing/Navbar";
import Hero from "../components/landing/Hero";
import About from "../components/landing/About";
import Skills from "../components/landing/Skills";
import WorkHistory from "../components/landing/WorkExperience";
import Contact from "../components/landing/Contact";
import Footer from "../components/landing/Footer";
import Project from "@/components/landing/Project";
import FloatingToggle from "@/components/landing/FloatingToggle";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <WorkHistory />
      <Project />
      <Contact />
      <Footer />
      <FloatingToggle />
    </>
  );
}
