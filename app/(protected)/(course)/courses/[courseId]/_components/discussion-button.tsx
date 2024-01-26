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
        "flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <MessageSquareText
          size={22}
          className={cn(
            "text-slate-500 dark:text-foreground",
            isActive && "text-slate-700 dark:text-foreground"
          )}
        />
        <span
          className={cn(
            "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-60",
            isActive && "text-slate-700 dark:text-foreground"
          )}
        >
          Course discussion
        </span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default DiscussionButton;
