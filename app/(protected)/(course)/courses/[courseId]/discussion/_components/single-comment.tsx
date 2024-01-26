"use client";

import { formatDate } from "@/lib/format";
import { Loader2, Reply as ReplyIcon, TextQuote, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Comment, Reply } from "@prisma/client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useCallback, useEffect, useState } from "react";
import ReplyForm from "./reply-form";
import Replies from "./replies";

type CommentsListType = Comment & {
  user: {
    name: string | null;
    image: string | null;
  } | null;
};

interface CommentsListProps {
  comment: CommentsListType;
  userId: string;
}

type ReplyWithUser = Reply & {
  user: {
    name: string | null;
    image: string | null;
  } | null;
};

const SingleComment = ({ comment, userId }: CommentsListProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const [selectedComment, setSelectedComment] = useState("");
  const [selectedReply, setSelectedReply] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [replies, setReplies] = useState<ReplyWithUser[]>([]);
  const [repliesCount, setRepliesCount] = useState(0);
  const [isReplyClicked, setIsReplyClicked] = useState(false);
  const [isShowRepliesClicked, setIsShowRepliesClicked] = useState(false);
  const params = useParams();
  const router = useRouter();

  const getReplies = useCallback(async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(
        `/api/courses/${params.courseId}/comments/${comment.id}/replies`
      );
      setReplies(response.data.replies);
      setRepliesCount(response.data.repliesCount);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsFetching(false);
    }
  }, [comment.id, params.courseId]);

  useEffect(() => {
    getReplies();
  }, [getReplies]);

  const deleteReply = async (commentId: string, replyId: string) => {
    try {
      setIsDeletingReply(true);
      setSelectedReply(replyId);
      await axios.delete(
        `/api/courses/${params.courseId}/comments/${commentId}/replies/${replyId}`
      );
      toast.success("Deleted");
      setReplies(replies.filter((reply) => reply.id !== replyId));
      setRepliesCount((prev) => prev - 1);
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeletingReply(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      setIsDeleting(true);
      setSelectedComment(commentId);
      await axios.delete(
        `/api/courses/${params.courseId}/comments/${commentId}`
      );
      toast.success("Deleted");
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsDeleting(false);
    }
  };

  const showReplies = async () => {
    setIsReplyClicked(false);
    setIsShowRepliesClicked(true);
  };

  return (
    <div>
      <div className="flex flex-col p-2" key={comment.id}>
        <Separator />
        <div className="flex items-center gap-x-1 pt-6">
          <Image
            src={comment.user?.image!}
            alt="Image"
            className="rounded-full border"
            width={50}
            height={50}
          />
          <div className="flex flex-col gap-1">
            <span className="font-bold">{comment.user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt)}
            </span>
          </div>
        </div>
        <p className="p-2 pl-4">{comment.comment}</p>
        <div>
          {!isShowRepliesClicked ? (
            <Button
              onClick={showReplies}
              size="sm"
              variant="ghost"
            >
              {isFetching ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <TextQuote className="h-4 w-4 mr-2" />
              )}
              {repliesCount > 0
                ? repliesCount === 1
                  ? `Show ${repliesCount} reply`
                  : `Show ${repliesCount} replies`
                : "No replies"}
            </Button>
          ) : (
            <Button
              onClick={() => setIsShowRepliesClicked(false)}
              size="sm"
              variant="ghost"
            >
              <TextQuote className="h-4 w-4 mr-2" />
              Hide replies
            </Button>
          )}

          <Button
            onClick={() => {
              setIsReplyClicked(!isReplyClicked);
              setIsShowRepliesClicked(false);
            }}
            size="sm"
            variant="ghost"
          >
            <ReplyIcon className="h-4 w-4 mr-2" />
            Reply
          </Button>
          {userId === comment.userId && (
            <Button
              onClick={() => deleteComment(comment.id)}
              size="sm"
              variant="ghost"
            >
              {isDeleting && selectedComment === comment.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          )}
        </div>
        {isReplyClicked && (
          <ReplyForm
            commentId={comment.id}
            setReplies={setReplies}
            setRepliesCount={setRepliesCount}
          />
        )}
      </div>
      {!isReplyClicked &&
        isShowRepliesClicked &&
        replies.map((reply) => (
          <div key={reply.id}>
            <Replies
              isDeletingReply={isDeletingReply}
              selectedReply={selectedReply}
              deleteReply={deleteReply}
              reply={reply}
              userId={userId}
              commentId={comment.id}
            />
          </div>
        ))}
    </div>
  );
};

export default SingleComment;
