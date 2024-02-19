"use client";

import { Button } from "@/components/ui/button";
import { Comment, Reply, Report, User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/format";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axios from "axios";

export const columns: ColumnDef<
  Report & {
    reporter: User;
    comment:
      | (Comment & {
          user: User | null;
        })
      | null;
    reply:
      | (Reply & {
          user: User | null;
        })
      | null;
  }
>[] = [
  {
    accessorKey: "IssuedBy",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Issued by
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => row.reporter.name,
    cell: ({ row }) => {
      const { id, name, image } = row.original.reporter;
      return (
        <Link
          href={`/profile/${id}`}
          className="flex gap-1 items-center hover:text-sky-700"
        >
          <Image
            src={image!}
            alt="Image"
            className="rounded-full h-[40px] w-[40px] border"
            width={40}
            height={40}
          />
          <p>{name}</p>
        </Link>
      );
    },
  },
  {
    accessorKey: "IssuedAgainst",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Issued against
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) =>
      row.commentId ? row.comment?.user?.name : row.reply?.user?.name,
    cell: ({ row }) => {
      const id = row.original.commentId
        ? row.original.comment?.user?.id
        : row.original.reply?.user?.id;
      const name = row.original.commentId
        ? row.original.comment?.user?.name
        : row.original.reply?.user?.name;
      const image = row.original.commentId
        ? row.original.comment?.user?.image
        : row.original.reply?.user?.image;
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
    accessorKey: "reportedContent",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reported content
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) =>
      row.commentId ? row.comment?.comment : row.reply?.reply,
    cell: ({ row }) => {
      const reportedContent = row.original.commentId
        ? row.original.comment?.comment
        : row.original.reply?.reply;
      const courseId = row.original.courseId;
      return (
        <Link
          href={`/courses/${courseId}/discussion`}
          className="flex gap-1 items-center hover:text-sky-700"
        >
          {reportedContent}
        </Link>
      );
    },
  },
  {
    accessorKey: "reportReason",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reason
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.reportReason;
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
          Issued at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    accessorFn: (row) => formatDate(row.createdAt as Date),
    cell: ({ row }) => {
      const createDate = row.getValue("createdAt");
      return createDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id, courseId } = row.original;
      const onClick = async () => {
        await axios.delete(`/api/courses/${courseId}/reports/${id}`);
        window.location.assign("/admin/reports");
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
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
