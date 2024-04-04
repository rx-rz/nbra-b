"use client";
import { useSearchParams } from "next/navigation";
import Editor from "../components/editor";
import { Suspense, useEffect } from "react";
import { useBlogStore } from "../store/blog_store";
import { BookMinus, Home, RotateCw, SearchIcon } from "lucide-react";

export default function Page() {
  const searchParams = useSearchParams();
  const { setDraftID } = useBlogStore();
  const draftId = searchParams.get("draft_id");

  useEffect(() => {
    if (!draftId) {
      setDraftID("");
    }
  }, [draftId, setDraftID]);

  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto mt-4">
          <RotateCw className="animate-spin" />
        </div>
      }
    >
      <div>
        {/* <header className="flex justify-between mt-3 mx-3 text-xs border-b pb-2">
        <Link
          href={"/"}
          className="font-bold flex gap-1 items-center font-gambarino"
        >
          <Home fill="#000" stroke="#fff" />
          <div className="leading-3">
            <p>roqeebatu</p>
            <p>abeni</p>
          </div>
        </Link>
        <div className="flex gap-4">
          <Link href={"/drafts"}>
            <BookMinus />
          </Link>
          <Link href={"/search"}>
            <SearchIcon />
          </Link>
        </div>
      </header> */}
        <Editor draft_id={draftId} />
      </div>
    </Suspense>
  );
}
