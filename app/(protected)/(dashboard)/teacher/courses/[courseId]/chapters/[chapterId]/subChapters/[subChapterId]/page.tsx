import { IconBadge } from "@/components/icon-badge";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  ArrowLeft,
  File,
  LayoutDashboard,
  Video,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import Banner from "@/components/banner";
import SubChapterActions from "./_components/sub-chapter-action";
import SubChapterDescriptionForm from "./_components/sub-chapter-description-form";
import SubChapterVideoForm from "./_components/sub-chapter-video-form";
import SubChapterAttachmentForm from "./_components/sub-chapter-attachment-form";
import SubChapterTitleForm from "./_components/sub-chapter-title-form";

const SubChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string; subChapterId: string };
}) => {
  const user = await currentUser();

  if (!user?.id) return redirect("/");

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      subChapters: true,
    },
  });

  const subChapter = await db.subChapter.findUnique({
    where: {
      id: params.subChapterId,
      chapterId: params.chapterId,
    },
    include: {
      chapterAttachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
      muxData: true,
    },
  });

  if (!subChapter || !chapter) {
    return redirect("/");
  }

  const requiredFields = [
    subChapter.title,
    subChapter.description,
    // subChapter.muxData,
    subChapter.chapterAttachments.length !== 0,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length; //return values !== null

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean); //every item in the list should be true

  return (
    <>
      {
        !isComplete && <Banner
          variant="warning"
          label="Complete all the fields to be able to publish the course"
        />
      }
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6 w-1/3"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to chapter setup
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Sub-chapter setup</h1>
                <span className="text-sm text-slate-700 dark:text-foreground">
                  Complete all fields {completionText}
                </span>
              </div>
              <SubChapterActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                subChapterId={params.subChapterId}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your sub-chapter</h2>
              </div>
              <SubChapterTitleForm
                initialData={subChapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
                subChapterId={params.subChapterId}
              />
              <SubChapterDescriptionForm
                initialData={subChapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
                subChapterId={params.subChapterId}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">Resources & Attachments</h2>
              </div>
              <SubChapterAttachmentForm
                initialData={subChapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
                subChapterId={params.subChapterId}
              />
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Video} />
                <h2 className=" text-xl">Add a video</h2>
              </div>
              {/* <SubChapterVideoForm
                initialData={subChapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
                subChapterId={params.subChapterId}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SubChapterIdPage;
