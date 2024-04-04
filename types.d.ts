type BlogContent = {
  title: string;
  content: string;
  author: "Roqeebat Bolarinwa";
  subtitle: string;
  date_created: string;
  header_image: string;
  tags: string[];
  is_draft: boolean;
  id?: string;
};

type CreateBlogComponentProps = {
  blog: BlogContent | undefined;
  setBlog: Dispatch<SetStateAction<BlogContent | undefined>>;
  setStoredBlog: (blog: BlogContent) => void;
  storedBlog: BlogContent | undefined;
};
