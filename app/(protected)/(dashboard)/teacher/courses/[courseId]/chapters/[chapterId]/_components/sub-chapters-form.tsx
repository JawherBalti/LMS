"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chapter, ChapterAttachment, Course, MuxData, SubChapter } from "@prisma/client";
import axios from "axios";
import { Loader2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";
import SubChaptersList from "./sub-chapters-list";

type SubChaptersWithData = SubChapter & {
    muxData: MuxData | null,
    chapterAttachments: ChapterAttachment[]
   }

type ChapterWithSubChapters = Chapter & {
  subChapters: SubChaptersWithData[]
}

interface SubChaptersFormProps {
//   initialData: Course & { chapters: Chapter[] };
  initialData: ChapterWithSubChapters
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Subchapter title is required",
  }),
});

const SubChaptersForm = ({ initialData, courseId, chapterId }: SubChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const router = useRouter();
  const toggleCreate = () => setIsCreating((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/subChapters`, values);
      toast.success("Sub-chapter created");
      toggleCreate();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/subChapters/reorder`, {
        list: updateData,
      });
      toast.success("Sub-chapters reordered");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/subChapters/${id}`);
  };

  return (
    <div className="relative mt-6 border bg-slate-100 dark:bg-background rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-md flex items-center justify-center ">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Chapter sub-chapters
        <Button onClick={toggleCreate} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a sub-chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            className="space-y-4 mt-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white dark:bg-input"
                      disabled={isSubmitting}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.subChapters.length && "text-slate-500 italic"
          )}
        >
          {!initialData.subChapters.length && "No sub-chapters"}
          <SubChaptersList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.subChapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="text-xs text-muted-foreground mt-4">
          Drag & Drop to reorder sub-chapters
        </p>
      )}
    </div>
  );
};

export default SubChaptersForm;
