"use client";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { UploadDropzone } from "@/lib/uploadthing";
import { usePathname } from "next/navigation";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  const pathname = usePathname()

  return (
    <UploadDropzone
      className={pathname.includes("settings") ? "mt-0 flex items-center justify-center h-60 w-60 bg-slate-200 rounded-full border-none" : ""}
      endpoint={endpoint}
      onClientUploadComplete={(res) => onChange(res?.[0].url)}
      onUploadError={(error: Error) => toast.error(`${error.message}`)}
    />
  );
};
