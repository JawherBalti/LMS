"use client";

import { cn } from "@/lib/utils";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
  icon: React.ForwardRefExoticComponent<
    IconProps & React.RefAttributes<SVGSVGElement>
  >;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActive =
    (pathname === "/dashboard" && href === "/dashboard") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    router.push(href);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20", isActive && "text-sky-700 bg-sky-200/20 hover:bg-sky-200/20 hover:text-sky-700"
      )}
    >
        <div className="flex items-center gap-x-2 py-4">
            <Icon
                className={cn(
                    "text-slate-500", isActive && "text-sky-700"
                )}
            />
            {label}
        </div>
        <div
            className={cn(
                "ml-auto opacity-0 border-2 border-sky-700 h-full transition-all", isActive && "opacity-100"
            )}
        />
    </button>
  );
};

export default SidebarItem;