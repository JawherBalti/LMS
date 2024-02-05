"use client";

import MobileSidebar from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const Navbar = () => {
  return (
    <nav className="border-b p-4 h-full flex items-center bg-white dark:bg-background shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </nav>
  );
};
