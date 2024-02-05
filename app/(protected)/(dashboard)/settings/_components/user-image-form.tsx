"use client";

import { FileUpload } from "@/components/file-upload";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { UserRole } from "@prisma/client";
import axios from "axios";
import { AlertTriangle, CheckCircle, Pencil } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import * as z from "zod";

interface UserImageFormProps {
  initialData: User & {
    role: UserRole;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
}

const formSchema = z.object({
  image: z.string().min(1, {
    message: "Image is required",
  }),
});

const UserImageForm = ({ initialData }: UserImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const { update } = useSession();
  const { toast } = useToast();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/profile`, values);
      toast({
        title: "Profile picture updated",
        description: "You have updated your profile",
        action: (
          <CheckCircle className="text-emerald-600 dark:text-emerald-600" />
        ),
        className: "border-black dark:border-white",
      });
      update();
      toggleEdit();
      router.refresh();
    } catch {
      toast({
        title: "Something went wrong",
        action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
        className: "border-black dark:border-white",
      });
    }
  };

  return (
    <div className="mt-6 borde rounded-md">
      <div className="text-sm font-medium">Profile picture</div>
      {!isEditing &&
        (!initialData.image ? (
          <div className="mt-4 flex flex-col justify-center items-center w-44">
            <div className="h-44 w-full rounded-full border-2">
              <Avatar className="h-full w-full">
                <AvatarFallback className="bg-sky-500">
                  <FaRegUser className="text-white h-24 w-24" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-2">
              <Button onClick={toggleEdit} variant="ghost">
                <Pencil className="h-4 w-4 mr-2" />
                Edit image
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-col justify-center items-center w-44">
            <div className="mt-2">
              <Image
                width={100}
                height={100}
                alt="Upload"
                className="border-2 rounded-full h-44 w-44"
                src={initialData.image}
              />
            </div>
            <div className="mt-2">
              <Button onClick={toggleEdit} variant="ghost">
                <Pencil className="h-4 w-4 mr-2" />
                Edit image
              </Button>
            </div>
          </div>
        ))}
      {isEditing && (
        <div className="mt-4 flex flex-col justify-center items-center w-44">
          <FileUpload
            endpoint="profilePicture"
            onChange={(url) => {
              if (url) onSubmit({ image: url });
            }}
          />
          <Button className="mt-2" onClick={toggleEdit} variant="ghost">
            {isEditing && <>Cancel</>}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserImageForm;
