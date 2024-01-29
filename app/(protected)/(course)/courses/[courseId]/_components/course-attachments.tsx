"use client";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { File, Folder } from "lucide-react";
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
            "h-14 max-w-full flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20",
            isOpen &&
              "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700"
          )}
        >
          <div className="flex items-center gap-x-2 py-4">
            <Folder
              size={22}
              className={cn(
                "text-slate-500 dark:text-foreground",
                isOpen && "text-slate-700 dark:text-foreground"
              )}
            />
            <span
              className={cn(
                "text-slate-500 dark:text-foreground break-words line-clamp-2 w-48 sm:w-52 md:w-60",
                isOpen && "text-slate-700 dark:text-foreground"
              )}
            >
              Course attachments
            </span>
          </div>
          <div
            className={cn(
              "ml-auto opacity-0 border-2 border-slate-700 h-full transition-all",
              isOpen && "opacity-100"
            )}
          />
        </button>
      </CollapsibleTrigger>

      <CollapsibleContent>
        {purchase && course.attachments.length > 0 ? (
          course.attachments.map((att) => (
            <div
              key={att.id}
              className="flex items-center p-3 w-full bg-secondary border text-sky-700"
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
