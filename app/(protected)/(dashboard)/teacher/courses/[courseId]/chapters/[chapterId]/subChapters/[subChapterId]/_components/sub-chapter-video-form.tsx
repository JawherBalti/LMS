"use client";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { MuxData, SubChapter } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, CheckCircle, Pencil, PlusCircle, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import * as z from "zod";
import MuxPlayer from "@mux/mux-player-react";
import { useToast } from "@/components/ui/use-toast";

interface ChapterVideoFormProps {
  initialData: SubChapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
  subChapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const SubChapterVideoForm = ({
  initialData,
  courseId,
  chapterId,
  subChapterId
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const {toast} = useToast()
  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/subChapters/${subChapterId}`,
        values
      );
      toast({
        title: "Sub-chapter updated",
        description: "You have added a video",
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

  return (
    <div className="mt-6 border bg-slate-100 dark:bg-background rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Sub-chapter video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 dark:bg-secondary rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <MuxPlayer
              className="h-60"
              playbackId={initialData?.muxData?.playbackId!}
            />
          </div>
        ))}
      {isEditing && (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) onSubmit({ videoUrl: url });
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            Upload the chapter&apos;s video
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Videos take few minutes to process. Refresh the page if the video does
          not appear
        </div>
      )}
    </div>
  );
};

export default SubChapterVideoForm;
