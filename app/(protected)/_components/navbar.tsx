"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/auth/user-button";
import Container from "@/components/ui/container";
import MobileSidebar from "./mobile-sidebar";
import { NavbarRoutes } from "@/components/navbar-routes";

export const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="border-b p-4 h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
      {/* <Container>
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-end">
          <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
            <p className="font-bold text-3xl capitalize text-emerald-950">
              Etudet
            </p>
          </Link>
        </div>
          <UserButton />
      </Container> */}
    </nav>
  );
};
