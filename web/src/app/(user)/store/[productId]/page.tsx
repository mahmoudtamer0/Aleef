// Server Component: reads the id from the URL and hands it to the client component that loads the data.
import type { Metadata } from "next";
import { BackLink } from "@/components/BackLink/BackLink";
import { ProductDetails } from "@/components/ProductDetails/ProductDetails";
import { routes } from "@/config/routes";

export const metadata: Metadata = { title: "Product" };

export default async function ProductPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = await params;
  return (
    <>
      <BackLink href={routes.store} label="Back to the store" />
      <ProductDetails productId={productId} />
    </>
  );
}
