import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import AdminSidebar from "./admin-sidebar";

const AdminMobileSidebar = () => {
  return (
    <Sheet>
      <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
        <HamburgerMenuIcon />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 bg-white">
        <AdminSidebar />
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileSidebar;
