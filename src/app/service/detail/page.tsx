import { Suspense } from "react";
import ServiceDetailClient from "./ServiceDetailClient";

export default function ServiceDetailPage() {
  return <Suspense><ServiceDetailClient /></Suspense>;
}
