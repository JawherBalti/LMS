import { Poppins } from "next/font/google";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LoginButton } from "@/components/auth/login-button";
import { redirect } from "next/navigation";
import bg from "../public/home.jpg";
import Image from "next/image";
import { CarouselData } from "@/components/carousel-data";
import { getFreeCourses } from "@/actions/get-free-courses";
import { GetServerSidePropsContext } from "next";
import { headers } from "next/headers";
import { ModeToggle } from "@/components/mode-toggle";
import { getRecentCourses } from "@/actions/get-recent-courses";
import { getMostRatedCourses } from "@/actions/get-most-rated-courses";
import { Navbar } from "./(protected)/(dashboard)/_components/navbar";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});
const data = [
  1,2,3,4,5,6,7,8,9
]

export default async function Home(props: any) {
  const date = new Date();
  const freeCourses = await getFreeCourses();
  const recentCourses = await getRecentCourses()
  const mostRatedCourses = await getMostRatedCourses()
  
  const headersList = headers();
  const activePath = headersList.get("x-invoke-path");
// const activeUrl = headersList.get("referer");
// const activeHost = headersList.get("host");


  return (
    // redirect("/auth/login")
    <>
        <Navbar/>

      <main className="flex h-full flex-col">
        <div className="p-4 sm:p-6 lg:p-8 rounded-xl">
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
                  <Button variant="default" size="lg" className="bg-white text-black hover:bg-slate-300 hover:text-black">
                    Sign in
                  </Button>
                </LoginButton>
              </div>
            </div>
            <Image src="/home.jpg" alt="banner" width={1300} height={100} />
          </div>
        </div>
        <div className="flex-1 h-full">
          <div className="p-4 sm:p-6 lg:p-8">
            <h6
              className={cn(
                "text-2xl font-semibold text-foreground drop-shadow-md",
                font.className
              )}
            >
              Free courses
            </h6>
            <CarouselData data={freeCourses}/>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <h6
              className={cn(
                "text-2xl font-semibold text-foreground drop-shadow-md",
                font.className
              )}
            >
              Recently added
            </h6>
            <CarouselData data={recentCourses}/>
          </div>
          <div className="p-4 sm:p-6 lg:p-8">
            <h6
              className={cn(
                "text-2xl font-semibold text-foreground drop-shadow-md",
                font.className
              )}
            >
              Most Rated
            </h6>
            <CarouselData data={mostRatedCourses}/>
          </div>
        </div>
      </main>
      <footer className="border-t h-16 bg-white text-black flex items-center justify-center">
        &copy; {date.getFullYear()} Courset, Inc. All rights reserved
      </footer>
    </>
  );
}
