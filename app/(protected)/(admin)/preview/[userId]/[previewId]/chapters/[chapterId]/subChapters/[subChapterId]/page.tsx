import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardTitle } from "@/components/ui/card";
import { VideoPlayer } from "./_components/video-player";
import Image from "next/image";
import Link from "next/link";
import getChapterAdmin from "@/actions/get-chapter-admin";
import PdfViewer from "./_components/pdf-viewer";

const SubChpaterIdPage = async ({
  params,
}: {
  params: {
    userId: string;
    previewId: string;
    chapterId: string;
    subChapterId: string;
  };
}) => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");
  if (user?.role !== "ADMIN") return redirect("/dashboard");

  const {
    subChapter,
    chapter,
    course,
    courseOwner,
    muxData,
    chapterAttachments,
    nextChapter,
    nextSubChapter,
  } = await getChapterAdmin({
    userId: params.userId,
    chapterId: params.chapterId,
    courseId: params.previewId,
    subChapterId: params.subChapterId,
  });

  if (!subChapter || !chapter || !course) {
    return redirect("/admin/courses");
  }


  return (
    <div className="overflow-x-hidden">
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <CardTitle className="p-4 pl-0">Course owner:</CardTitle>
        <Link
          href={`/profile/${courseOwner.id}`}
          className="flex items-center gap-x-1 pb-4"
        >
          <Image
            src={courseOwner.image!}
            alt="Image"
            className="rounded-full border"
            width={40}
            height={40}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">{courseOwner.name}</span>
          </div>
        </Link>
        <Separator />
        <CardTitle className="p-4 pl-0">Course description:</CardTitle>
        <p className="break-words pl-4 pb-4">{course?.description}</p>
        <Separator />
        <div className="p-4">
          {/* <VideoPlayer
            chapterId={params.chapterId}
            title={chapter?.title!}
            courseId={params.previewId}
            nextChapter={nextChapter!}
            nextSubChapterId={nextSubChapter?.id!}
            playBackId={muxData?.playbackId!}
            completeOnEnd={true}
          /> */}
          <PdfViewer subChapterAttachments={chapterAttachments}/>
        </div>
        <div className="full">
          <div className="p-4 pl-0 flex flex-col md:flex-row items-center justify-between w-full">
            <h2 className="text-2xl font-semibold mb-2 break-words line-clamp-1 w-full">
              {subChapter?.title}
            </h2>
          </div>
          <Separator />
          <CardTitle className="p-4 pl-0">Description:</CardTitle>
          <Preview value={subChapter?.description!} />
          <Separator />
          <CardTitle className="p-4 pl-0">Attachments:</CardTitle>
          {chapterAttachments.length ? (
            <>
              <div className="p-4 space-y-2">
                {chapterAttachments.map((att) => (
                  <a
                    className="flex items-center space-x-2 p-3 w-full bg-sky-200 dark:bg-secondary border text-sky-700 rounded-md hover:underline"
                    target="_blank"
                    href={att.url}
                    key={att.id}
                  >
                    <File />
                    <p>{att.name}</p>
                  </a>
                ))}
              </div>
            </>
          ) : (
            <span className="pl-4">No attachments available.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubChpaterIdPage;
