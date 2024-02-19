import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

const ReportsPage = async () => {
  const user = await currentUser();
  if (!user?.id) return redirect("/");
  if (user?.role !== "ADMIN") return redirect("/dashboard");

  const reports = await db.report.findMany({
    include: {
      reporter: true,
      comment: {
        include: {
          user: true
        }
      },
      reply: {
        include: {
          user: true
        }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="p-6">
      <DataTable columns={columns} data={reports} />
    </div>
  );
};

export default ReportsPage;
