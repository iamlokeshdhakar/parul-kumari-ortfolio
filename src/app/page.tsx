import { About } from "@/components/home/about";
import { Experience } from "@/components/home/experience";
import { Footer } from "@/components/home/footer";
import { Hero } from "@/components/home/hero";
import { Navbar } from "@/components/home/navbar";
import { Projects } from "@/components/home/projects";
import { Skills } from "@/components/home/skills";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
      
        <Hero />
        <About />
        <Skills />
        <Experience />
        {/* <Projects /> */}
      </main>
      <Footer />
    </>
  );
}
