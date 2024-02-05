"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCurrentUser } from "@/hooks/use-current-user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Reply } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

type RepliesListType = Reply & {
  user: {
    name: string | null;
    image: string | null;
  } | null;
};

interface ReplyFormProps {
  commentId: string;
  setReplies: React.Dispatch<React.SetStateAction<RepliesListType[]>>;
  setRepliesCount: React.Dispatch<React.SetStateAction<number>>;
}

const formSchema = z.object({
  replyValue: z.string().min(1, {
    message: "Text is required",
  }),
});

const ReplyForm = ({
  commentId,
  setReplies,
  setRepliesCount,
}: ReplyFormProps) => {
  const { toast } = useToast();

  const user = useCurrentUser();
  const params = useParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      replyValue: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const reply = await axios.post(
        `/api/courses/${params.courseId}/comments/${commentId}/replies`,
        values
      );
      setReplies((prev: RepliesListType[]) => [
        {
          id: reply.data.id,
          commentId: reply.data.commentId,
          reply: reply.data.reply,
          userId: reply.data.userId,
          createdAt: reply.data.createdAt,
          updatedAt: reply.data.updatedAt,
          user: {
            name: user?.name!,
            image: user?.image!,
          },
        },
        ...prev,
      ]);
      setRepliesCount((prev) => prev + 1);
      toast({
        title: "Reply created",
        description: "You have replied to a comment",
        action: (
          <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
        ),
        className: "border-black dark:border-white",
      });
      form.reset();
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-4 mt-4" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="replyValue"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="bg-white dark:bg-input"
                  disabled={isSubmitting}
                  placeholder="Reply to a comment"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-x-2">
          <Button disabled={!isValid || isSubmitting} type="submit">
            Reply
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ReplyForm;
