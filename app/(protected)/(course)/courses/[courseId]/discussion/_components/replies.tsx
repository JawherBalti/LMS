"use client";

import { formatDate } from "@/lib/format";
import { Loader2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reply } from "@prisma/client";

type RepliesListType = Reply & {
  user: {
    name: string | null;
    image: string | null;
  } | null;
};

interface RepliesListProps {
  reply: RepliesListType;
  userId: string;
  commentId: string;
  isDeletingReply: boolean;
  selectedReply: string;
  deleteReply: (commentId: string, replyId: string) => Promise<void>;
}

const Replies = ({
  reply,
  userId,
  commentId,
  isDeletingReply,
  selectedReply,
  deleteReply,
}: RepliesListProps) => {
  return (
    <div className="pl-8">
      <div className="flex flex-col p-2">
        <Separator />
        <div className="flex items-center gap-x-1 pt-6">
          <Image
            src={reply.user?.image!}
            alt="Image"
            className="rounded-full border"
            width={40}
            height={40}
          />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold">{reply.user?.name}</span>
            <span className="text-xs text-muted-foreground">
              {formatDate(new Date(reply.createdAt))}
            </span>
          </div>
        </div>
        <p className="p-2 pl-4">{reply.reply}</p>
        <div>
          {userId === reply.userId && (
            <Button
              onClick={() => deleteReply(commentId, reply.id)}
              size="sm"
              variant="ghost"
            >
              {isDeletingReply && selectedReply === reply.id ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <X className="h-4 w-4 mr-2" />
              )}
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Replies;
