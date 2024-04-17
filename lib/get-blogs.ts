import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../config/firebase-config";

export const useGetBlogs = () => {
  const [blogs, setBlogs] = useState<BlogContent[]>([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [blogError, setBlogError] = useState<any>();

  useEffect(() => {
    const getAllDocs = async () => {
      try {
        setBlogLoading(true);
        const blogRef = collection(database, "blogs");
        const blogQuery = query(blogRef, where("is_draft", "==", false));
        const querySnapshot = await getDocs(blogQuery);
        const blogs: BlogContent[] = [];
        querySnapshot.forEach((doc) => {
          blogs.push({
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
        blogs.sort((a, b) => (a.date_created < b.date_created ? 1 : -1));
        setBlogs(blogs);
      } catch (err) {
        setBlogError(err);
      } finally {
        setBlogLoading(false);
      }
    };

    getAllDocs();
  }, []);

  return { blogs, blogLoading, blogError };
};
