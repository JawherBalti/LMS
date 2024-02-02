import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface ChapterItemProps {
    label: string
    Icon: LucideIcon
  isLocked: boolean;
  isOpen: boolean
  setIsOpen: Dispatch<SetStateAction<boolean>>
}

const ChapterItem = ({ label, Icon, isLocked, isOpen, setIsOpen }: ChapterItemProps) => {
  const params = useParams();
  const pathname = usePathname();

  const isChapterActive = pathname.includes(params.chapterId as string);

  return (
    <button
      onClick={() => {
        isLocked ? setIsOpen(false) : setIsOpen(!isOpen);
      }}
      type="button"
      className={cn(
        "h-14 max-w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
        isChapterActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500 dark:text-foreground",
            isChapterActive && "text-slate-700 dark:text-foreground"
          )}
        />
        <span
          className={cn(
            "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-60",
            isChapterActive && "text-slate-700 dark:text-foreground"
          )}
        >
          {label}
        </span>
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
          isChapterActive && "opacity-100"
        )}
      />
    </button>
  );
};

export default ChapterItem;
