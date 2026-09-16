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
  let categories: Awaited<ReturnType<typeof getActiveCategories>> = [];
  let products: Awaited<ReturnType<typeof getActiveProductsWithVariants>> = [];

  try {
    [categories, products] = await Promise.all([
      getActiveCategories(),
      getActiveProductsWithVariants(),
    ]);
  } catch (err) {
    // Storefront degrades to an empty grid rather than a hard crash if
    // Supabase is unreachable or not yet configured.
    console.error("Failed to load storefront data:", err);
  }

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
