"use client";

import {
  Chapter,
  ChapterAttachment,
  MuxData,
  SubChapter,
} from "@prisma/client";
import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { Grip, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type SubChapterWithData = SubChapter & {
  muxData: MuxData | null;
  chapterAttachments: ChapterAttachment[];
};
interface SubChaptersListProps {
  items: SubChapterWithData[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
}

const SubChaptersList = ({
  items,
  onReorder,
  onEdit,
}: SubChaptersListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [subChapters, setSubChapters] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSubChapters(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(subChapters);

    const [reorderedItems] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItems);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedChapters = items.slice(startIndex, endIndex + 1);

    setSubChapters(items);

    const bulkUpdateData = updatedChapters.map((chapter) => ({
      id: chapter.id,
      position: items.findIndex((item) => item.id === chapter.id),
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="subChapters">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {subChapters.map((subChapter, index) => (
              <Draggable
                key={subChapter.id}
                draggableId={subChapter.id}
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 dark:bg-background border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      subChapter.title &&
                        subChapter.description &&
                        subChapter.muxData &&
                        subChapter.chapterAttachments.length !== 0 &&
                        "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-sky-200 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-l-md transition",
                        subChapter.title &&
                          subChapter.description &&
                          subChapter.muxData &&
                          subChapter.chapterAttachments.length !== 0 &&
                          "border-r-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h5 w-5 dark:text-white" />
                    </div>
                    <span className="dark:text-white break-words line-clamp-1">
                      {subChapter.title}
                    </span>
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      {!subChapter.title ||
                      !subChapter.description ||
                      !subChapter.muxData ||
                      subChapter.chapterAttachments.length === 0 ? (
                        <Badge className="bg-slate-500">
                          Complete all fields
                        </Badge>
                      ) : (
                        <Badge className="bg-sky-700">Fields completed</Badge>
                      )}
                      <Pencil
                        className="w-4 h-4 cursor-pointer dark:text-white hover:opacity-75 transition"
                        onClick={() => onEdit(subChapter.id)}
                      />
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default SubChaptersList;
