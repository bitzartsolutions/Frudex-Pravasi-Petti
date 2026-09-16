import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustPillars } from "@/components/home/TrustPillars";
import { ProductGrid } from "@/components/products/ProductGrid";
import { OrderSection } from "@/components/order/OrderSection";
import { PettiBar } from "@/components/petti/PettiBar";
import { PettiDrawer } from "@/components/petti/PettiDrawer";
import { getActiveCategories, getActiveProductsWithVariants } from "@/lib/data/storefront";

export const revalidate = 60;

export default async function HomePage() {
  // getActiveCategories/getActiveProductsWithVariants never throw — they
  // catch internally and return [] on any failure, so a Supabase outage
  // or missing env var degrades to an empty grid instead of crashing the
  // page (or the build, during static generation).
  const [categories, products] = await Promise.all([
    getActiveCategories(),
    getActiveProductsWithVariants(),
  ]);

  return (
    <>
      <Header />
      <main className="w-full pt-20 bg-background flex-1 flex flex-col">
        <div className="flex flex-col w-full bg-background text-on-surface">
          <Hero />
          <HowItWorks />
          <ProductGrid categories={categories} products={products} />
          <OrderSection />
          <TrustPillars />
        </div>
      </main>
      <PettiBar />
      <PettiDrawer />
      <Footer />
    </>
  );
}
