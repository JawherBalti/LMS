"use client"

import Link from "next/link";
import AdminSidebarRoutes from "./admin-sidebar-routes";

const AdminSidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white dark:bg-background shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-end">
        <Link href="/" className="ml-4 flex lg:ml-0 gap-x-2">
          <p className="font-bold text-3xl capitalize text-emerald-950 dark:text-foreground">
            Etudet
          </p>
        </Link>
      </div>
      <div className="flex flex-col w-full">
        <AdminSidebarRoutes/>
      </div>
    </div>
  );
};

export default AdminSidebar;
