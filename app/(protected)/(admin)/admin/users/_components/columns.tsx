"use client";

import { Button } from "@/components/ui/button";
import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Ban, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import axios from "axios";
import Link from "next/link";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.name,
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <Link
          href={`/profile/${id}`}
          className="flex gap-1 items-center hover:text-sky-700"
        >
          <Image
            src={row.original.image!}
            alt="Image"
            className="rounded-full border"
            width={40}
            height={40}
          />
          <p>{row.getValue("name")}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.email,
    cell: ({ row }) => {
      const email = row.getValue("email");
      return email;
    },
  },
  {
    accessorKey: "emailVerified",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Joined
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => formatDate(row.emailVerified as Date),
    cell: ({ row }) => {
      const joinDate = row.getValue("emailVerified");
      return joinDate;
    },
  },
  {
    accessorKey: "isBlocked",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => (row.isBlocked ? "Blocked" : "Active"),
    cell: ({ row }) => {
      const isBlocked = row.original.isBlocked;
      return (
        <Badge
          className={cn(
            "bg-emerald-700 hover:bg-emerald-700 text-white",
            isBlocked && "bg-red-700 hover:bg-red-700"
          )}
        >
          {isBlocked ? "Blocked" : "Active"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => (row.role === "ADMIN" ? "Admin" : "User"),
    cell: ({ row }) => {
      const role = row.original.role;
      return (
        <Badge
          className={cn(
            "bg-slate-700 hover:bg-slate-700 text-white",
            role === "ADMIN" && "bg-sky-700 hover:bg-sky-700"
          )}
        >
          {role === "ADMIN" ? "Admin" : "User"}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const { isBlocked } = row.original;
      const onClick = async () => {
        await axios.patch("/api/user", { isBlocked: isBlocked, userId: id });
        window.location.assign("/admin/users");
      };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-4 w-9 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div onClick={onClick}>
              <DropdownMenuItem>
                <Ban className="h-4 w-4 mr-2" />
                {isBlocked ? "Unblock" : "Block"}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
