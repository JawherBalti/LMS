"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExitIcon, BackpackIcon } from "@radix-ui/react-icons";
import SearchInput from "./search-input";
import { ModeToggle } from "./mode-toggle";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/course");
  const isSearchPage = pathname === "/search";

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex items-center gap-x-2 ml-auto">
        {isTeacherPage || isCoursePage|| isAdminPage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <ExitIcon className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <BackpackIcon className="h-4 w-4 mr-2" />
              Teacher mode
            </Button>
          </Link>
        )}
        <ModeToggle/>
        <UserButton />
      </div>
    </>
  );
};
