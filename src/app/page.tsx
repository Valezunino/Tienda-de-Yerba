import { Storefront } from "@/components/storefront";
import { getProducts } from "@/lib/products";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await getProducts();
  return <Storefront initialProducts={products} />;
}
