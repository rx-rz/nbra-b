"use client";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { database } from "@/config/firebase-config";
import { DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { doc, getDoc } from "firebase/firestore";
import { BookMinus, Home, RotateCw, SearchIcon } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

type Params = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Params) {
  const [blog, setBlog] = useState<BlogContent>();
  const proseMirrorRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scrollHandler = () => {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const clientHeight =
        document.documentElement.clientHeight || document.body.clientHeight;

      const windowHeight = scrollHeight - clientHeight;
      const percent = (scrollTop / windowHeight) * 100;
      setProgress(percent);
    };

    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  useEffect(() => {
    async function getBlog() {
      const blogRef = doc(database, "blogs", id ?? "0");
      const blogDoc = await getDoc(blogRef);
      if (blogDoc.exists()) {
        setBlog({
          author: blogDoc.data().author,
          content: blogDoc.data().content,
          date_created: blogDoc.data().date_created,
          header_image: blogDoc.data().header_image,
          is_draft: false,
          subtitle: blogDoc.data().subtitle,
          tags: blogDoc.data().tags,
          title: blogDoc.data().title,
          id: blogDoc.id,
        });
      }
    }
    getBlog();
  }, [id]);

  if (blog) {
    return (
      <>
        {/* <header className="flex justify-between mt-3 mx-3 text-xs border-b pb-2">
          <Link
            href={"/"}
            className="font-bold flex gap-1 items-center font-gambarino"
          >
            <Home fill="#000" stroke="#fff" />
            <div className="leading-3">
              <p>roqeebatu</p>
              <p>abeni</p>
            </div>
          </Link>
          <div className="flex gap-4">
            <Link href={"/drafts"}>
              <BookMinus />
            </Link>
            <Link href={"/search"}>
              <SearchIcon />
            </Link>
          </div>
        </header> */}
        <Image
          src={blog.header_image}
          alt="Header Image"
          priority
          width={3000}
          height={500}
          className="object-cover w-screen max-h-[600px]"
        />
        <div className=" mt-4 ">
          <div className="mx-4 mt-4 text-center">
            <p className="mt-2">
              [
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="mx-1 text-xs hover:underline underline-offset-2 cursor-pointer"
                >
                  {tag}
                </span>
              ))}
              ]
            </p>
            <h1 className="xl:text-5xl lg:text-4xl text-3xl pt-4 pb-1 font-bold  font-gambarino">
              {blog.title}
            </h1>
            <p className="text-sm md:text-base">{blog.subtitle}</p>

            <p className="text-xs opacity-75 my-2">
              Published on{" "}
              {moment
                .unix(Number.parseInt(blog.date_created) / 1000)
                .format("MMMM D, YYYY")}
            </p>
          </div>
          <div className="sticky top-0  bg-white">
            <Progress value={progress} />
          </div>
          <div className="w-full  pt-10 justify-center text-justify font-switzer">
            <div
              className=" mt-10 w-fit mx-auto font-switzer ProseMirror max-w-[66ch] "
              ref={proseMirrorRef}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            <div className="max-w-[63ch] mx-auto">
              <Dialog>
                <DialogTrigger>
                  <Button>Reply</Button>
                </DialogTrigger>
                <DialogContent>
                  <p>Hello</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="w-fit mx-auto mt-4">
        <RotateCw className="animate-spin" />
      </div>
    </>
  );
}
