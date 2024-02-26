"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { SubChapter } from "@prisma/client";
import { CheckCircle, ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PreviewSubChapter from "./preview-sub-chapter";

interface CourseSidebarItemProps {
  label: string;
  courseId: string;
  chapterId: string;
  subChapters: SubChapter[];
}

const PreviewSidebarItem = ({
  label,
  courseId,
  chapterId,
  subChapters,
}: CourseSidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();
  const Icon = CheckCircle
  const isChapterActive = params.chapterId === chapterId;

  useEffect(() => {
if(params.chapterId === chapterId) setIsOpen(true)
  },[params.chapterId, chapterId])

  return (
    <Collapsible open={isOpen}>
      <CollapsibleTrigger asChild className="w-full">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          type="button"
          className={cn(
            "relative h-14 max-w-full text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-sky-300/20 hover:dark:bg-sky-300/10",
            isChapterActive &&
              "text-slate-700 bg-sky-300/20 dark:bg-sky-300/10 hover:text-slate-700"
          )}
        >
          <div className="flex items-center gap-x-1 md:gap-x-3">
            <Icon
              size={22}
              className={cn(
                "text-slate-500 dark:text-foreground ml-2",
                isChapterActive &&
                  "text-sky-700 dark:text-sky-700"
              )}
            />
            <span
              className={cn(
                "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-56",
                isChapterActive &&
                  "text-sky-700 dark:text-sky-700"
              )}
            >
              {label}
            </span>
            <ChevronDown
              size={22}
              className={cn(
                "text-slate-500 dark:text-foreground",
                isChapterActive &&
                  "text-sky-700 dark:text-sky-700"
              )}
            />
          </div>
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {subChapters.map((subChapter) => (
          <PreviewSubChapter
            key={subChapter.id}
            courseId={courseId}
            chapterId={chapterId}
            subChapterId={subChapter.id}
            subChapter={subChapter}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PreviewSidebarItem;
