import { Suspense } from "react";
import ProductDetailClient from "./ProductDetailClient";

export default function ProductDetailPage() {
  return <Suspense><ProductDetailClient /></Suspense>;
}
