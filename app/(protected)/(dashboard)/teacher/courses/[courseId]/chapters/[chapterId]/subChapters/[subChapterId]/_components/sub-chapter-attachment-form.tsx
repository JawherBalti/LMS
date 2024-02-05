"use client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ChapterAttachment, SubChapter } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, CheckCircle, File, Loader2, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";

interface ChapterAttachmentFormProps {
initialData: SubChapter & {
    chapterAttachments: ChapterAttachment[]
}
  courseId: string;
  chapterId: string
  subChapterId: string
}

const formSchema = z.object({
  url: z.string().min(1),
});

const SubChapterAttachmentForm = ({ initialData, courseId, chapterId, subChapterId }: ChapterAttachmentFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}/subChapterAttachments`, values);
      toast({
        title: "Attachment added",
        description: "You have added an attachment",
        action: (
          <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
        ),
        className: "border-black dark:border-white",
      });
      toggleEdit();
      router.refresh();
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    }
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}/subChapterAttachments/${id}`);
      toast({
        title: "Attachment deleted",
        description: "You have deleted an attachment",
        action: (
          <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
        ),
        className: "border-black dark:border-white",
      });
      router.refresh();
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Sub-chapter attachments
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a file
            </>
          )}
        </Button>
      </div>
       {!isEditing && (
        <>
          {initialData.chapterAttachments.length === 0 && (
            <p className="text-sm mt2 teslate-500 italic">No attachments yet</p>
          )}
          {initialData.chapterAttachments.length > 0 && (
            <div className="space-y-2">
              {initialData.chapterAttachments.map((att) => (
                <div
                  key={att.id}
                  className="flex items-center p-3 w-full bg-sky-100 dark:bg-secondary border-sky-200 border text-sky-700 rounded-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="text-xs line-clamp-1">{att.name}</p>
                  {deletingId === att.id ? (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onDelete(att.id)}
                      className="ml-auto hover:opacity-75 transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterAttachment"
            onChange={(url) => {
              if (url) onSubmit({ url: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Add files your students might need to complete the chapter
          </div>
        </div>
      )}
    </div>
  );
};

export default SubChapterAttachmentForm;
