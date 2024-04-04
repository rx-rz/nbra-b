"use client";
import { useBlogStore } from "@/app/store/blog_store";
import { database } from "@/config/firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export const useGetDraft = ({ id }: { id: string | null }) => {
  const [draft, setDraft] = useState<BlogContent>();
  const [draftIsLoading, setDraftIsLoading] = useState(false);
  const { setDraftID } = useBlogStore();
  useEffect(() => {
    async function getDraft() {
      setDraftIsLoading(true);
      const draftRef = doc(database, "blogs", id ?? "0");
      const draftDoc = await getDoc(draftRef);
      if (draftDoc.exists()) {
        setDraft({
          author: draftDoc.data().author,
          content: draftDoc.data().content,
          date_created: draftDoc.data().date_created,
          header_image: draftDoc.data().header_image,
          is_draft: false,
          subtitle: draftDoc.data().subtitle,
          tags: draftDoc.data().tags,
          title: draftDoc.data().title,
          id: draftDoc.id,
        });
        setDraftID(draftDoc.id);
      }
      setDraftIsLoading(false);
    }
    if (id) getDraft();
  }, [id]);
  return { draft, draftIsLoading };
};
