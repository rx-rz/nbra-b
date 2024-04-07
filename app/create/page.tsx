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
        <Editor draft_id={draftId} />
      </div>
    </Suspense>
  );
}
