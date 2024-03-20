import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import { redirect } from "next/navigation";
import bg from "../public/home.jpg";
import Image from "next/image";
const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
export default function Home() {
  return (
    // redirect("/auth/login")
    <main className="flex h-full flex-col items-center justify-center">
      <div className="p-4 sm:p-6 lg:p-8 rounded-xl overflow-hidden">
        <div className="rounded-xl relative aspect-square md:aspect-[2.4/1] overflow-hidden bg-cover">
          <div className="absolute h-full w-full flex flex-col justify-center text-left gap-y-8">
            <div
              style={{ lineHeight: 1.3 }}
              className="text-white font-semibold text-3xl pl-5 sm:text-5xl lg:text-6xl sm:max-w-3xl max-w-xs"
            >
              Sign-in, Choose a topic and expand your knowledge
            </div>
            <div className="pl-4">
              <LoginButton>
                <Button variant="default" size="lg">
                  Sign in
                </Button>
              </LoginButton>
            </div>
          </div>
          <Image src="/home.jpg" alt="banner" width={1300} height={800} />
        </div>
      </div>
      <div className="space-y-6 text-center">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          Auth
        </h1>
        <p className="text-white text-lg">A simple authentication service</p>
      </div>
    </main>
  );
}
