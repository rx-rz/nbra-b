import { database } from "@/config/firebase-config";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";

type Comment = {
  comment: string;
  date_created: string;
  name: string;
  postId: string;
  id: string;
};
export const useGetComments = ({ blogId }: { blogId: string }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  console.log({ comments });
  useEffect(() => {
    setCommentLoading(true);
    async function getAllDocs() {
      const commentRef = collection(database, "comments");
      const commentQuery = query(commentRef, where("postId", "==", blogId));

      const querySnapshot = await getDocs(commentQuery);
      const comments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        comments.push({
          id: doc.id,
          comment: doc.data().comment,
          date_created: doc.data().date_created,
          name: doc.data().name ?? "Anonymous",
          postId: doc.data().postId,
        });
      });
      comments.sort((a, b) => (a.date_created < b.date_created ? 1 : -1));
      setComments(comments);
    }
    getAllDocs();
    setCommentLoading(false);
  }, [blogId]);
  return { comments, commentLoading };
};
