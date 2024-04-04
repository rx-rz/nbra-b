import moment from "moment";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type BlogState = {
  blog: BlogContent;
  setBlog: (blog: BlogContent) => void;
  draftID: string;
  setDraftID: (id: string) => void;
};

export const useBlogStore = create<BlogState>()(
  persist(
    (set) => ({
      blog: {
        content: "",
        author: "Roqeebat Bolarinwa",
        date_created: moment.now().toString(),
        header_image: "",
        is_draft: true,
        subtitle: "",
        tags: [],
        title: "",
      },
      setBlog: (blog) => {
        set(() => ({ blog: blog }));
      },
      draftID: "",
      setDraftID: (id) => {
        set(() => ({ draftID: id }));
      },
    }),
    {
      name: "blog-store-props",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
