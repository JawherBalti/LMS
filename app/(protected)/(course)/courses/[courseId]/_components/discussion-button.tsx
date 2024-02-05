"use client";
import { cn } from "@/lib/utils";
import { MessageSquareText } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

const DiscussionButton = ({ courseId }: { courseId: string }) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = pathname.includes("/discussion");

  const onClick = () => {
    router.push(`/courses/${courseId}/discussion`);
  };
  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "relative max-w-full text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-sky-300/20 hover:dark:bg-sky-300/10",
        isActive &&
          "text-slate-700 bg-sky-300/20 dark:bg-sky-300/10 hover:text-slate-700"
      )}
    >
      <div className="flex items-center py-4 gap-x-1 md:gap-x-3">
        <MessageSquareText
          size={22}
          className={cn(
            "text-slate-500 dark:text-foreground ml-2",
            isActive && "text-sky-700 dark:text-sky-700"
          )}
        />
        <span
          className={cn(
            "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-56",
            isActive && "text-sky-700 dark:text-sky-700"
          )}
        >
          Course discussion
        </span>

      </div>
      <div
        className={cn(
          "absolute top-0 right-0 opacity-0 border-2 border-sky-700 h-full w-1 transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default DiscussionButton;
