"use client";
import { Progress } from "@/app/components/ui/progress";
import { useBlogStore } from "@/app/store/blog_store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { database } from "@/config/firebase-config";
import { useGetComments } from "@/lib/get-comments";
import { DialogDescription } from "@radix-ui/react-dialog";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
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
  const { setDraftID } = useBlogStore();
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [progress, setProgress] = useState(0);
  const [commentSubmissionLoading, setCommentSubmissionLoading] =
    useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    setDraftID("");
  }, [setDraftID]);

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
    if (comment) {
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

  const validateEmail = () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email.trim());
  };

  const addToSubscribersList = async () => {
    setSubscriptionLoading(true);
    setIsSubscribed(false);
    if (!validateEmail()) {
      alert("Please enter a valid email address.");
      return;
    }
    const subscriberRef = collection(database, "subscribers");
    const querySnapshot = await getDocs(
      query(subscriberRef, where("email", "==", email))
    );
    if (!querySnapshot.empty) {
      setIsSubscribed(true);
    } else {
      addDoc(subscriberRef, {
        email,
        date_subscribed: moment.now(),
      }).then(() => {
        setIsSubscribed(true);
      });
    }
    setSubscriptionLoading(false);
  };

  const { comments } = useGetComments({ blogId: id });

  if (blog) {
    return (
      <>
        <div className="sticky top-11  bg-white">
          <Progress value={progress} />
        </div>
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
            <h1 className="xl:text-5xl lg:text-4xl text-3xl pt-4 pb-1 font-bold  font-gambarino">
              {blog.title}
            </h1>
            <p className="text-sm md:text-base max-w-xl mx-auto font-bold text-opacity-75 opacity-75 mt-4">{blog.subtitle}</p>

            <p className="text-xs opacity-75 my-2">
              Published on{" "}
              {moment
                .unix(Number.parseInt(blog.date_created) / 1000)
                .format("MMMM D, YYYY")}
            </p>
          </div>

          <div className="w-[95%]  md:pt-10  max-w-[66ch]  mx-auto font-switzer">
            <div
              className=" md:mt-10 mt-6 w-fit  text- font-switzer ProseMirror text-justify"
              ref={proseMirrorRef}
              dangerouslySetInnerHTML={{ __html: blog.content }}
            ></div>
            <div className="w-fit mx-auto">
              <Dialog>
                <DialogTrigger>
                  <Button className="mx-auto bg-accent md:text-sm text-xs md:p-3 p-2 text-white mb-8">
                    Subscribe to blog
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[500px] w-[95%] rounded-md">
                  <DialogDescription className="mt-2">
                    <p className="mb-4">
                      Glad you want to subscribe! Please enter your email in the
                      input box below:
                    </p>
                    <Input onChange={(e) => setEmail(e.target.value)} />
                  </DialogDescription>
                  <DialogFooter>
                    {isSubscribed ? (
                      <Button
                        variant={"outline"}
                        className="w-full bg-accent text-white cursor-pointer"
                        disabled
                      >
                        Subscribed! You can close this dialog.
                      </Button>
                    ) : (
                      <Button
                        variant={"outline"}
                        className="w-full bg-accent text-white cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          addToSubscribersList();
                        }}
                      >
                        {subscriptionLoading ? (
                          <RotateCw size={30} className="animate-spin" />
                        ) : (
                          "Subscribe"
                        )}
                      </Button>
                    )}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {comments ? (
              <>
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="pb-5 border-b last-of-type:border-none"
                  >
                    <div className="flex gap-2 items-center">
                      <p className="text-sm font-bold opacity-90">
                        {comment.name}
                      </p>
                      <p className="text-xs opacity-75">
                        {moment(comment.date_created).fromNow()}
                      </p>
                    </div>
                    <p className="mt-1 md:text-base text-xs">
                      {" "}
                      {comment.comment}
                    </p>
                  </div>
                ))}
              </>
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
                className="mx-auto bg-accent md:text-base text-xs md:p-4 p-2 text-white mb-8"
              >
                {commentSubmissionLoading ? (
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
