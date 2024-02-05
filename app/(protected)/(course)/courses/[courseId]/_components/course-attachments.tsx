"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, File, Folder } from "lucide-react";
import { Attachment, Course, Purchase } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface CourseAttachmentsProps {
  course: Course & {
    attachments: Attachment[];
  };
  purchase: Purchase;
}
const CourseAttachments = ({ course, purchase }: CourseAttachmentsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Collapsible open={isOpen}>
      <CollapsibleTrigger asChild className="w-full">
        <button
          onClick={onClick}
          type="button"
          className={cn(
            "relative h-14 max-w-full text-slate-500 text-sm font-[500] transition-all hover:text-slate-600 hover:bg-sky-300/20 hover:dark:bg-sky-300/10",
            isOpen &&
              "text-slate-700 bg-sky-300/20 dark:bg-sky-300/10 hover:text-slate-700"
          )}
        >
          <div className="flex items-center py-4 gap-x-1 md:gap-x-3">
            <Folder
              size={22}
              className={cn(
                "text-slate-500 dark:text-foreground ml-2",
                isOpen && "text-sky-700 dark:text-sky-700"
              )}
            />
            <span
              className={cn(
                "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-56",
                isOpen && "text-sky-700 dark:text-sky-700"
              )}
            >
              Course attachments
            </span>
            <ChevronDown
              size={22}
              className={cn(
                "text-slate-500 dark:text-foreground",
                isOpen &&
                  "text-sky-700 dark:text-sky-700"
              )}
            />
          </div>
          {/* <div
            className={cn(
              "absolute top-0 right-0 opacity-0 border-2 border-sky-700 h-full transition-all",
              isOpen && "opacity-100"
            )}
          /> */}
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {purchase && course.attachments.length > 0 ? (
          course.attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center p-3 w-full bg-sky-300/10 dark:bg-sky-300/5 border-b text-sky-700"
            >
              <File className="h-4 w-4 mr-2 flex-shrink-0" />
              <a
                target="_blank"
                href={att.url}
                className="text-xs line-clamp-1"
              >
                {att.name}
              </a>
            </div>
          ))
        ) : (
          <div
            className="flex items-center p-3 w-full bg-secondary border"
          >
            <p className="text-xs">
              This course has no attachments or you did not buy it
            </p>
          </div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default CourseAttachments;
