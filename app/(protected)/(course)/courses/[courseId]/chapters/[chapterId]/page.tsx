import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getChapter } from "@/actions/get-chapter";
import Banner from "@/components/banner";
import { VideoPlayer } from "./_components/video-player";
import CourseEnrollButton from "./_components/course-enroll-button";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CourseProgressButton from "./_components/course-progress-button";
import { CardTitle } from "@/components/ui/card";

const ChpaterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");

  const {
    chapter,
    course,
    muxData,
    attachments,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: user.id,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course) return redirect("/dashboard");

  const isLocked = !chapter.isFree && !purchase;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner variant="success" label="You already completed this chapter." />
      )}

      {isLocked && (
        <Banner variant="warning" label="You need to purchase this chapter." />
      )}

      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id!}
            playBackId={muxData?.playbackId!}
            isLocked={isLocked}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="full">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between w-full">
            <h2 className="text-2xl font-semibold mb-2 break-words line-clamp-1 w-full">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <CardTitle className="p-4 pl-0">Course description:</CardTitle>
            <p className="break-words pl-4 pb-4">{course.description}</p>
          <Separator />
          <CardTitle className="p-4 pl-0">Chapter description:</CardTitle>
            <Preview value={chapter.description!} />
          <Separator />
          <CardTitle className="p-4 pl-0">Attachments:</CardTitle>
          {attachments.length ? (
            <>
              <div className="p-4">
                {attachments.map((att) => (
                  <a
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                    target="_black"
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
            <span className="pl-4">No attachments</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChpaterIdPage;
