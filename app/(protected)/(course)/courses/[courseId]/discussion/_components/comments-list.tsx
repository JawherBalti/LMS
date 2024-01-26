import { currentUser } from "@/lib/auth";
import { Comment } from "@prisma/client";
import SingleComment from "./single-comment";

type CommentsListType = Comment & {
  user: {
    name: string | null;
    image: string | null;
  } | null;
};

interface CommentsListProps {
  comments: CommentsListType[];
}

const CommentsList = async ({ comments }: CommentsListProps) => {
  const user = await currentUser();

  return (
      <div>
      {comments.map(comment => (
        <SingleComment key={comment.id} comment={comment} userId={user?.id!} />
      ))}
      </div>
  );
};

export default CommentsList;
