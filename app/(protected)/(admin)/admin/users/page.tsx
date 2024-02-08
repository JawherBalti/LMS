import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const UsersPage = async () => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");
  if (user?.role !== "ADMIN") return redirect("/dashboard");

  const users = await db.user.findMany({
    orderBy: {
      emailVerified: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={users} />
    </div>
  );
};

export default UsersPage;
