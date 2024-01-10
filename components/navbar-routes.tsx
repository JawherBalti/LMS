"use client";

import { usePathname, useRouter } from "next/navigation";
import { UserButton } from "./auth/user-button";
import { Button } from "./ui/button";
import Link from "next/link";
import { ExitIcon, BackpackIcon } from "@radix-ui/react-icons";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPlayerPage = pathname?.startsWith("/chapter");

  return (
    <div className="flex items-center gap-x-2 ml-auto">
      {isTeacherPage || isPlayerPage ? (
          <Link href="/dashboard">
        <Button size="sm" variant="ghost">
          <ExitIcon className="h-4 w-4 mr-2" />
          Exit
        </Button>
        </Link>
      ) : (
        <Link href="/teacher/courses">
          <Button size="sm" variant="ghost">
            <BackpackIcon className="h-4 w-4 mr-2"/>
            Teacher mode
          </Button>
        </Link>
      )}
      <UserButton />
    </div>
  );
};
