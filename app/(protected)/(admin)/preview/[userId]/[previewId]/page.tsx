import { db } from "@/lib/db";
import { redirect } from "next/navigation";

const PreviewIdPage = async ({params}: {params: {userId: string, previewId: string}}) => {
  const course = await db.course.findUnique({
    where: {
      id: params.previewId,
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

  return redirect(`/preview/${params.userId}/${course.id}/chapters/${course.chapters[0].id}/subChapters/${course.chapters[0].subChapters[0].id}`);
};
  
  export default PreviewIdPage