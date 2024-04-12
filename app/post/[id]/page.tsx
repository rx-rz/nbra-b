"use client";
import { Progress } from "@/app/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { database } from "@/config/firebase-config";
import { useGetComments } from "@/lib/get-comments";

import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { RotateCw } from "lucide-react";
import moment from "moment";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

type Params = {
  params: {
    id: string;
  };
};

export default function Page({ params: { id } }: Params) {
  const [blog, setBlog] = useState<BlogContent>();
  const proseMirrorRef = useRef<HTMLDivElement | null>(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(true);
  const [commentSubmissionLoading, setCommentSubmissionLoading] =
    useState(false);

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

  async function handleSubmitComment() {
    setCommentSubmissionLoading(true);
    await addDoc(collection(database, "comments"), {
      comment,
      name,
      postId: id,
      date_created: moment.now(),
    }).then(() => {
      setCommentSubmissionLoading(false);
      location.reload();
    });
  }

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

  const { comments, commentLoading } = useGetComments({ blogId: id });
  if (blog) {
    return (
      <>
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
          <div className="w-[95%]  pt-10  max-w-[66ch]  mx-auto font-switzer">
            <div
              className=" mt-10 w-fit  text-justify font-switzer ProseMirror "
              ref={proseMirrorRef}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            <h1 className="text-2xl font-bold">Comments</h1>
            {comments ? (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="py-5 border-b last-of-type:border-none"
                >
                  <div className="flex gap-2 items-center">
                    <p className="text-sm font-bold opacity-90">
                      {comment.name}
                    </p>
                    <p className="text-xs opacity-75">
                      {moment(comment.date_created).fromNow()}
                    </p>
                  </div>
                  <p className="mt-1"> {comment.comment}</p>
                </div>
              ))
            ) : (
              <></>
            )}
            <form action="">
              <input
                type="text"
                className="w-full p-3 mt-6 border rounded-sm"
                placeholder="Enter your name (not compulsory)"
                onChange={(e) => setName(e.target.value)}
              />
              <textarea
                className="resize-none mt-2 w-full border rounded-sm focus:border-black p-3"
                rows={6}
                placeholder="Enter your comment"
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant={"outline"}
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmitComment();
                }}
                className="cursor-pointer bg-black text-white  mb-3 border text-sm  rounded-md p-1 px-3"
              >
                {commentLoading ? (
                  <RotateCw className="animate-spin" />
                ) : (
                  "Comment"
                )}
              </Button>
            </form>
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
