import { getProfileCourses } from "@/actions/get-profile-courses";
import { getUser } from "@/actions/get-user";
import CoursesList from "@/components/courses-list";
import { formatCourseReview, formatDate } from "@/lib/format";
import { Star } from "lucide-react";
import Image from "next/image";

const ProfilePage = async ({ params }: { params: { profileId: string } }) => {
  const courses = await getProfileCourses(params.profileId);
  const user = await getUser(params.profileId);

  const totalReviewsList = courses.reduce(
    (acc, curr) => acc + curr.courseReview,
    0
  );

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-x-1 pb-4">
        <Image
          src={user?.image!}
          alt="Image"
          className="rounded-full border"
          width={80}
          height={80}
        />
        <div className="flex flex-col gap-2 p-4">
          <span className="text-base font-bold">{user?.name}</span>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-slate-500">
              Joined: {formatDate(user?.emailVerified!).substring(0, 10)}
            </span>
            <div className="flex gap-3">
              <span className="text-sm font-bold text-slate-500">
                Total courses: {courses.length}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-slate-500">
                Average rating:{" "}
                {formatCourseReview(totalReviewsList / courses.length)}{" "}
                <Star
                  size={14}
                  fill="rgb(234 179 8 / var(--tw-text-opacity))"
                  className=" text-yellow-500"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
      <h2 className="font-bold">Courses created by: {user?.name}</h2>
      <CoursesList items={courses} />
    </div>
  );
};

export default ProfilePage;
