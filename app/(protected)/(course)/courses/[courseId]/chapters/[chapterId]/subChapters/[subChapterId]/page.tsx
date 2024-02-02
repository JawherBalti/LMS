import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CardTitle } from "@/components/ui/card";
import { VideoPlayer } from "./_components/video-player";
import CourseProgressButton from "./_components/course-progress-button";
import CourseEnrollButton from "./_components/course-enroll-button";

const SubChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string; subChapterId: string };
}) => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");

  const {
    subChapter,
    chapter,
    course,
    muxData,
    chapterAttachments,
    nextChapter,
    nextSubChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: user.id,
    chapterId: params.chapterId,
    courseId: params.courseId,
    subChapterId: params.subChapterId,
  });

  if (!subChapter || !chapter || !course) {
    return redirect("/dashboard");
  }

  const isLocked = !chapter?.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="overflow-x-hidden">
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner
          variant="warning"
          label="This chapter is locked. Purchase the course to unlock it."
        />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <CardTitle className="p-4 pl-0">Course description:</CardTitle>
        <p className="break-words pl-4 pb-4">{course?.description}</p>
        <Separator />
        <div className="p-4">
          <VideoPlayer
            subChapterId={params.subChapterId}
            chapterId={params.chapterId}
            title={chapter?.title!}
            courseId={params.courseId}
            // nextChapterId={nextChapter?.id!}
            nextSubChapterId={nextSubChapter?.id!}
            playBackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="full">
          <div className="p-4 pl-0 flex flex-col md:flex-row items-center justify-between w-full">
            <h2 className="text-2xl font-semibold mb-2 break-words line-clamp-1 w-full">
              {subChapter?.title}
            </h2>
            {purchase ? (
              <CourseProgressButton
                subChapterId={params.subChapterId}
                chapterId={params.chapterId}
                courseId={params.courseId}
                // nextChapterId={nextChapter?.id}
                nextSubChapterId={nextSubChapter?.id!}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course?.price!}
              />
            )}
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
            <span className="pl-4">
              No attachments available or you did not purchase the course
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubChpaterIdPage;
