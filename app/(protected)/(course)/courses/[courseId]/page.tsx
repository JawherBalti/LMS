import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const Course = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          subChapters: {
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) return redirect("/dashboard");

  return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}/subChapters/${course.chapters[0].subChapters[0].id}`);
};

export default Course;
