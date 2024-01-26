import { getComments } from "@/actions/get-comments";
import DiscussionForm from "./_components/discussion-form";
import CommentsList from "./_components/comments-list";

const Discussion = async ({ params }: { params: { courseId: string } }) => {
  const comments = await getComments({ courseId: params.courseId });

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Course discussion</h1>
          </div>
        </div>
        <div className="flex flex-col gap-6 mt-10">
          <p>
            Welcome to the discussion section! In this section, you can discuss
            the challenges you faced in this course. Interact with your teacher
            and other students, ask questions, debate ideas and share knowledge
            to make this course more beneficial.
          </p>
          <DiscussionForm />
          <CommentsList comments={comments} />
        </div>
      </div>
    </>
  );
};

export default Discussion;
