import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import CoursesList from "@/components/courses-list";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}
//searchParams is a prop detected automatically by server components
const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");
  
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId: user.id,
    ...searchParams,
  });
  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>
      <div className="p-6 space-y-4">
        <Categories items={categories} />
        <CoursesList items={courses}/>
      </div>
    </>
  );
};

export default SearchPage;
