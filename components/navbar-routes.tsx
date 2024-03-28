"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExitIcon, BackpackIcon } from "@radix-ui/react-icons";
import SearchInput from "./search-input";
import { ModeToggle } from "./mode-toggle";
import { LoginButton } from "./auth/login-button";

export const NavbarRoutes = () => {
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isAdminPage = pathname?.startsWith("/admin");
  const isPreviwePage = pathname?.startsWith("/preview");
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isCoursePage = pathname?.includes("/course");
  const isSearchPage = pathname === "/search";
  return (
    <>
      {isHomePage && (
        <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
          <p className="font-bold text-3xl capitalize text-emerald-950 dark:text-foreground">
            Courset
          </p>
        </Link>
      )}
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex items-center gap-x-2 ml-auto">
        {isHomePage ? null : isTeacherPage ||
          isCoursePage ||
          isAdminPage ||
          isPreviwePage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <ExitIcon className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              <BackpackIcon className="h-4 w-4 mr-2" />
              Teacher mode
            </Button>
          </Link>
        )}
        <ModeToggle />
        {isHomePage ? (
          <LoginButton>
            <Button variant="default" size="default">
              Sign in
            </Button>
          </LoginButton>
        ) : (
          <UserButton />
        )}
      </div>
    </>
  );
};
