"use client";

import { formatDate } from "@/lib/format";
import { AlertTriangle, CheckCircle, Flag, Loader2, X } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Reply } from "@prisma/client";
import { ReportModal } from "@/components/modals/report-modal";
import { useState } from "react";
import RadioGroupForm from "./radio-group-form";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

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
  courseId: string
  isDeletingReply: boolean;
  selectedReply: string;
  deleteReply: (commentId: string, replyId: string) => Promise<void>;
}

const Replies = ({
  reply,
  userId,
  commentId,
  courseId,
  isDeletingReply,
  selectedReply,
  deleteReply,
}: RepliesListProps) => {
  const [reportReason, setReportReason] = useState("");
  const { toast } = useToast();
  
  const onClick = async () => {
    try {
      await axios.post(`/api/courses/${courseId}/reports`, {
        commentId: null,
        replyId: reply.id,
        reportReason,
      });

      toast({
        title: "Report sent",
        description: "A report was sent to the admin",
        action: (
          <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
        ),
        className: "border-black dark:border-white",
      });
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    }
  };

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
            <>
              <ReportModal
                radioGroup={<RadioGroupForm setReportReason={setReportReason} />}
                onConfirm={onClick}
              >
                <Button size="sm" variant="ghost">
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </Button>
              </ReportModal>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Replies;
