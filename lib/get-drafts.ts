import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../config/firebase-config";

export const useGetDrafts = () => {
  const [drafts, setDrafts] = useState<BlogContent[]>([]);
  const [draftLoading, setDraftLoading] = useState(false);
  useEffect(() => {
    setDraftLoading(true);
    async function getAllDocs() {
      const draftRef = collection(database, "blogs");
      const draftQuery = query(draftRef, where("is_draft", "==", true));

      const querySnapshot = await getDocs(draftQuery);
      const drafts: BlogContent[] = [];
      querySnapshot.forEach((doc) => {
        drafts.push({
          author: doc.data().author,
          content: doc.data().content,
          date_created: doc.data().date_created,
          header_image: doc.data().header_image,
          is_draft: doc.data().is_draft,
          subtitle: doc.data().subtitle,
          tags: doc.data().tags,
          title: doc.data().title,
          id: doc.id,
        });
      });
      drafts.sort((a, b) => (a.date_created < b.date_created ? 1 : -1));
      setDrafts(drafts);
    }
    getAllDocs();
    setDraftLoading(false);
  }, []);
  return { drafts, draftLoading };
};
