"use client";

import { FaRegUser } from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/use-current-user";
import {
  DashboardIcon,
  ExitIcon,
  GearIcon,
  MagicWandIcon,
} from "@radix-ui/react-icons";
import { UserButtonAction } from "../user-button-action";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/logout";

export const UserButton = () => {
  const user = useCurrentUser();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-sky-500">
            <FaRegUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
        {user?.role === "ADMIN" && (
          <UserButtonAction action={() => router.push("/admin")}>
            <DropdownMenuItem>
              <MagicWandIcon className="h-4 w-4 mr-2" />
              Admin
            </DropdownMenuItem>
          </UserButtonAction>
        )}

        <UserButtonAction action={() => router.push("/dashboard")}>
          <DropdownMenuItem>
            <DashboardIcon className="h-4 w-4 mr-2" />
            Dashboard
          </DropdownMenuItem>
        </UserButtonAction>

        <UserButtonAction action={() => router.push("/settings")}>
          <DropdownMenuItem>
            <GearIcon className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </UserButtonAction>

        <UserButtonAction action={() => logout()}>
          <DropdownMenuItem>
            <ExitIcon className="h-4 w-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </UserButtonAction>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
