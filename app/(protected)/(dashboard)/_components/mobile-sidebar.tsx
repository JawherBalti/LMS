"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Sidebar from "./sidebar";
import { usePathname } from "next/navigation";

const MobileSidebar = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <Sheet>
      {!isHomePage ? (
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <HamburgerMenuIcon />
        </SheetTrigger>
      ) : null}
      <SheetContent side="left" className="p-0 bg-white">
        <Sidebar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
