"use client";

import { usePathname } from "next/navigation";

import Navbar from "@/components/Navbar";
import { authRoutes } from "@/constants";

export default function NavbarWrapper() {
  const pathname = usePathname();
  const isAuthRoute = authRoutes.includes(pathname || "");
  return <>{!isAuthRoute && <Navbar />}</>;
}
