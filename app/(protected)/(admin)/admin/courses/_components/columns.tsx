"use client";

import { Button } from "@/components/ui/button";
import { Course, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import Link from "next/link";

export const columns: ColumnDef<Course & { user: User }>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.title,
    cell: ({ row }) => {
      const { id } = row.original;
      const { userId } = row.original;
      return (
        <Link
          href={`/preview/${userId}/${id}`}
          className="flex gap-1 items-center hover:text-sky-700"
        >
          <Image
            src={row.original.imageUrl!}
            alt="Image"
            className="rounded-full h-[40px] w-[40px] border"
            width={40}
            height={40}
          />
          <p>{row.getValue("title")}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "Owner",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.user.name,
    cell: ({ row }) => {
      const { id, name, image } = row.original.user;
      return (
        <Link
          href={`/profile/${id}`}
          className="flex gap-1 items-center hover:text-sky-700"
        >
          <Image
            src={image!}
            alt="Image"
            className="rounded-full border"
            width={40}
            height={40}
          />
          <p>{name}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.price,
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price") || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price);
      return formatted;
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => formatDate(row.createdAt as Date),
    cell: ({ row }) => {
      const createDate = row.getValue("createdAt");
      return createDate
    },
  },
  {
    accessorKey: "isPublished",
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
    accessorFn: (row) => row.isPublished ? "Published": "Pending",
    cell: ({ row }) => {
      const isPublished = row.getValue("isPublished") as boolean;
      return (
        <Badge
          className={cn(
            "bg-slate-700 hover:bg-slate-700 text-white",
            isPublished
              ? "bg-emerald-700 hover:bg-emerald-700"
              : "bg-sky-700 hover:bg-sky-700"
          )}
        >
          {isPublished ? "Published" : "Pending"}
        </Badge>
      );
    },
  },
];
