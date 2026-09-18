import Hero from "@/components/hero";
import About from "@/components/about";
import Reviews from "@/components/reviews";
import Reserve from "@/components/reserve";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Reviews />
      <Reserve />
      <Footer />
    </main>
  );
}