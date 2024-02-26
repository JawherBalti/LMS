import { currentUser } from "@/lib/auth";
import PreviewSidebar from "../_components/preview-sidebar";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import PreviewNavbar from "../_components/preview-navbar";

const PreviewLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { previewId: string };
}) => {
  const user = await currentUser();

  if (!user?.id) return redirect("/");
  if (user?.role !== "ADMIN") return redirect("/dashboard");

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
            include: {
              userProgress: {
                where: {
                  userId: user.id,
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
      attachments: true,
    },
  });

  if (!course) return redirect("/dashboard");

  return (
    <div className="h-full">
      <div className="h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <PreviewNavbar course={course}/>
      </div>

      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <PreviewSidebar course={course} />
      </div>
      <main className="md:pl-80 pt-[80px] h-full">{children}</main>
    </div>
  );
};

export default PreviewLayout;
