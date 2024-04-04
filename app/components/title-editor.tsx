"use client";
import { useState } from "react";

export const TitleEditor = ({
  storedBlog,
  setStoredBlog,
  setBlog,
  blog,
}: CreateBlogComponentProps) => {
  const [titleRows, setTitleRows] = useState(1);
  const [subtitleRows, setSubtitleRows] = useState(1);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (blog && storedBlog) {
      setStoredBlog({ ...storedBlog, title: e.target.value });
      setBlog({ ...storedBlog, title: e.target.value });
      setTitleRows(Math.max(e.target.value.split("\n").length, 1));
    }
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (blog && storedBlog) {
      setStoredBlog({ ...storedBlog, subtitle: e.target.value });
      setBlog({ ...storedBlog, subtitle: e.target.value });
      setSubtitleRows(Math.max(e.target.value.split("\n").length, 1));
    }
  };

  return (
    <>
      <textarea
        className="w-full text-center outline-none pt-3 border-none md:text-2xl text-xl lg:text-3xl font-bold focus:outline focus:outline-1 overflow-auto"
        placeholder="Enter title here...(Max 120 characters)"
        maxLength={120}
        defaultValue={blog ? blog.title : ""}
        onChange={handleTitleChange}
        rows={titleRows}
      />
      <textarea
        className="w-full outline-none pb-3 text-center border-none md:text-md text-xs lg:text-lg focus:outline focus:outline-1 overflow-auto"
        placeholder="Enter subtitle here...(Max 200 characters)"
        maxLength={200}
        defaultValue={blog ? blog.subtitle : ""}
        onChange={handleSubtitleChange}
        rows={subtitleRows}
      />
    </>
  );
};
