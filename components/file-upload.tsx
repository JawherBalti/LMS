"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { AlertTriangle } from "lucide-react";
import { usePathname } from "next/navigation";
import { useToast } from "./ui/use-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const pathname = usePathname();
  const { toast } = useToast();

  return (
    <UploadDropzone
      className={
        pathname.includes("settings")
          ? "ut-upload-icon:hidden ut-label:w-32 ut-label:text-[12px] ut-allowed-content:hidden ut-button:text-[12px] ut-button:w-20 ut-button:pt-3 ut-button:pb-3 mt-0 flex items-center justify-center h-44 w-44 bg-slate-200 rounded-full border-none"
          : ""
      }
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) =>
        toast({
          title: error.message,
          action: <AlertTriangle className="text-red-600 dark:text-red-600" />,
          className: "border-black dark:border-white",
        })
      }
    />
  );
};
