import { Suspense } from "react";
import OrderDetailClient from "./OrderDetailClient";

export default function OrderDetailPage() {
  return <Suspense><OrderDetailClient /></Suspense>;
}
