"use client";

import React from "react";
import {
  DashboardIcon,
  RocketIcon,
  FileTextIcon,
  BarChartIcon,
} from "@radix-ui/react-icons";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
  {
    icon: DashboardIcon,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: RocketIcon,
    label: "Browse",
    href: "/search",
  },
];

const teacherRoutes = [
  {
    icon: FileTextIcon,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChartIcon,
    label: "Analytics",
    href: "/teacher/analytics",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
