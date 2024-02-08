"use client";

import AdminSidebarItem from "./admin-sidebar-item";
import { BarChart, Flag, LayoutList, Users } from "lucide-react";

const adminRoutes = [
  {
    icon: Users,
    label: "Manage users",
    href:"/admin/users"
  },
  {
    icon: LayoutList,
    label: "Manage courses",
    href:"/admin/courses"
  },
  {
    icon: BarChart,
    label: "Analytics",
    href:"/admin/analytics"
  },
  {
    icon: Flag,
    label: "Reports",
    href:"/admin/reports"
  },
];

const AdminSidebarRoutes = () => {

  return (
    <div className="flex flex-col w-full">
      {adminRoutes.map((route) => (
        <AdminSidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default AdminSidebarRoutes;
