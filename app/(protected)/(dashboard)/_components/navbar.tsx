"use client";

import { usePathname } from "next/navigation";
import MobileSidebar from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b p-4 h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </nav>
  );
};
