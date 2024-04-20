import Link from "next/link";
import {
  BookMinus,
  HomeIcon,
  LucideBook,
  LucideEdit,
  LucideUser,
  SearchIcon,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGetBlogs } from "@/lib/get-blogs";
import Search from "./search";
import { useAuthStore } from "../store/auth_store";

const Navbar = () => {
  const { blogs } = useGetBlogs();
  const { user } = useAuthStore();
  return (
    <header className="flex justify-between pt-3 px-3 text-xs border- pb-2 sticky top-0 bg-white">
      <Link
        href={"/"}
        className="font-bold flex gap-1 items-center font-gambarino"
      >
        <div className="leading-3">
          <p>roqeebat</p>
          <p>bolarinwa</p>
        </div>
      </Link>
      <div className="flex gap-4">
        {user.email ? (
          <>
            {" "}
            <Link href={"/profile"} title="Check Profile">
              <LucideUser />
            </Link>
            <Link href={"/create"} title="Create Blog">
              <LucideEdit />
            </Link>
            <Link href={"/drafts"} title="Drafts">
              <BookMinus />
            </Link>
          </>
        ) : (
          <></>
        )}
        <Dialog>
          <DialogTrigger title="Search">
            <SearchIcon />
          </DialogTrigger>
          <DialogContent className="max-h-[700px] h-[100%] w-[95%] md:w-[80%] max-w-[1000px] overflow-y-scroll">
            <Search blogs={blogs} />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
};

export default Navbar;
