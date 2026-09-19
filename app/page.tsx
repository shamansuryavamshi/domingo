import Hero from "@/components/hero";
import Reserve from "@/components/reserve";
import Reviews from "@/components/reviews";
import About from "@/components/about";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Reserve />
      <Reviews />
      <About />
      <Footer />
    </main>
  );
}