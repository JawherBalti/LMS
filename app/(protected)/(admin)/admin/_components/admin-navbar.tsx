"use client";

import AdminMobileSidebar from "./admin-mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const AdminNavbar = () => {
  return (
    <nav className="border-b p-4 h-full flex items-center bg-white dark:bg-background shadow-sm">
      <AdminMobileSidebar/>
      <NavbarRoutes />
    </nav>
  );
};
