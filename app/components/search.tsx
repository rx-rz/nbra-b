"use client";
import { DialogClose } from "@/components/ui/dialog";
import { LucideAnnoyed } from "lucide-react";
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
    <div className="overflow-y-clip">
      <div className="mt-8"></div>
      <input
        className="border-b focus:outline-none focus:border-b-2 pb-1 w-full mx-auto sticky top-4 text-sm md:text-md lg:text-lg"
        placeholder="Search for blog post..."
        defaultValue={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <div className="max-h-[600px] h-[100%] w-full overflow-y-scroll ">
        {criteriaMeetingBlogs && criteriaMeetingBlogs.length > 0 ? (
          criteriaMeetingBlogs.map((blog) => (
            <Link href={`/post/${blog.id}`} key={blog.id}>
              <DialogClose className=" w-full">
                <div className=" lg:max-h-[200px] rounded-sm w-full">
                  <div className="p-3 flex justify-between text-left ">
                    <div className="w-2/5 h-[195px]">
                      <Image
                        alt={blog.title}
                        src={blog.header_image}
                        width={300}
                        height={180}
                        className="h-[95%]  object-cover border"
                      />
                    </div>
                    <div className="w-3/5 ml-4">
                      <h2 className="xl:text-3xl lg:text-2xl md:text-xl text-lg  font-bold font-gambarino">
                        {blog.title}
                      </h2>
                      <p className="md:mt-2 mt-1 text-xs md:text-base">
                        {blog.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              </DialogClose>
            </Link>
          ))
        ) : (
          <div className="w-fit mx-auto  mt-8">
            <LucideAnnoyed size={40} className="mx-auto" />
            <p className="mt-4">No blog matches.</p>
          </div>
        )}
      </div>
    </div>
  );
}
