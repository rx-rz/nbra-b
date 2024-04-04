import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function Search({
  blogs,
  tag,
}: {
  blogs: BlogContent[];
  tag?: string;
}) {
  const [criteriaMeetingBlogs, setCriteriaMeetingBlogs] = useState(blogs);
  const [inputText, setInputText] = useState(tag ? tag : "");

  useEffect(() => {
    const newBlogs = blogs.filter(
      (blog) =>
        blog.title.includes(inputText) ||
        blog.tags.join(",").includes(inputText) ||
        blog.subtitle.includes(inputText)
    );
    setCriteriaMeetingBlogs(newBlogs);
  }, [inputText, blogs]);
  return (
    <div>
      <div className="mt-8"></div>
      <input
        className="border-b focus:outline-none focus:border-b-2 w-full mx-auto sticky top-4 text-sm md:text-md lg:text-lg"
        placeholder="Search for blog post..."
        defaultValue={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="max-h-[600px] h-[100%] w-full overflow-y-scroll">
        {criteriaMeetingBlogs && criteriaMeetingBlogs.length > 0 ? (
          criteriaMeetingBlogs.map((blog) => (
            <Link key={blog.id} href={`/post/${blog.id}`}>
              <div className=" max-h-[200px] rounded-sm w-full">
                <div className="p-3 flex">
                  <div className="w-2/5 h-[190px]">
                    <Image
                      alt={blog.title}
                      src={blog.header_image}
                      width={300}
                      height={180}
                      className="h-[95%] object-cover border"
                    />
                  </div>
                  <div className="w-3/5 ml-4">
                    <h2 className="xl:text-3xl lg:text-2xl md:text-xl text-lg  font-bold font-gambarino">
                      {blog.title}
                    </h2>
                    <p className="md:mt-2 mt-1 text-xs md:text-base">{blog.subtitle}</p>
                    <p>
                      [
                      {blog.tags.map((tag) => (
                        <span key={tag} className="mx-1 text-xs">
                          {tag}
                        </span>
                      ))}
                      ]
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="mt-4">No blog matches.</p>
        )}
      </div>
    </div>
  );
}
