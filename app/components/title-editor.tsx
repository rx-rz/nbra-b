"use client";
import { useState } from "react";

export const TitleEditor = ({
  storedBlog,
  setStoredBlog,
}: CreateBlogComponentProps) => {
  const [titleRows, setTitleRows] = useState(1);
  const [subtitleRows, setSubtitleRows] = useState(1);

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (storedBlog) {
      setStoredBlog({ ...storedBlog, title: e.target.value });
      setTitleRows(Math.max(e.target.value.split("\n").length, 1));
    }
  };

  const handleSubtitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (storedBlog) {
      setStoredBlog({ ...storedBlog, subtitle: e.target.value });
      setSubtitleRows(Math.max(e.target.value.split("\n").length, 1));
    }
  };

  return (
    <>
      <textarea
        className="w-full text-center h-fit outline-none pt-3 resize-none border-none md:text-2xl text-2xl lg:text-3xl font-bold focus:outline focus:outline-1 overflow-auto"
        placeholder="Enter title here."
        defaultValue={storedBlog ? storedBlog.title : ""}
        onChange={handleTitleChange}

        rows={titleRows}
      />
      <textarea
        className="w-full outline-none pb-3 h-fit text-center resize-none border-none text-md lg:text-lg focus:outline focus:outline-1 overflow-auto"
        placeholder="Enter subtitle here"
        defaultValue={storedBlog ? storedBlog.subtitle : ""}
        onChange={handleSubtitleChange}
        rows={subtitleRows}
      />
    </>
  );
};
