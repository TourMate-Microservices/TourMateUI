"use client"

import { Suspense } from "react";
import MegaMenu from "@/components/mega-menu";
import Footer from "@/components/footer";
import { TourServiceDetail } from "@/components/tour-service-detail";
import { useParams } from "next/navigation"


export default function Page() {
    const params = useParams()

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MegaMenu />
      <TourServiceDetail id={typeof params.id === "string" ? params.id : ""} />
      <Footer />
    </Suspense>
  );
}
