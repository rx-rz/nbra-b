"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "../store/auth_store";
import Link from "next/link";
import {
  BookMinus,
  LucideBook,
  LucideEdit,
  LucideEye,
  LucideTrash2,
  RotateCw,
} from "lucide-react";
import { useGetSubscribers } from "@/lib/get-subscribers";
import moment from "moment";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useGetBlogs } from "@/lib/get-blogs";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { database } from "@/config/firebase-config";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { useBlogStore } from "../store/blog_store";
import withAuth from "../components/with-auth";

function Page() {
  const { user } = useAuthStore();
  const { subscribers, subscriberLoading } = useGetSubscribers();
  const { blogs, blogLoading } = useGetBlogs();
  const [defaultEmailMessage, setDefaultEmailMessage] = useState("");
  const { setDraftID } = useBlogStore();
  const [updateDefaultEmailIsLoading, setUpdateDefaultEmailIsLoading] =
    useState(false);

  useEffect(() => {
    setDraftID("");
  }, [setDraftID]);

  useEffect(() => {
    async function getEmailContentDoc() {
      const emailContentRef = doc(
        database,
        "emailcontent",
        "EoBZwNKSUVEfUmSA5knC"
      );
      const emailContentDoc = await getDoc(emailContentRef);
      if (emailContentDoc.exists()) {
        setDefaultEmailMessage(emailContentDoc.data()?.emailcontent || "");
      }
    }
    getEmailContentDoc();
  }, []);

  const updateEmailContent = async () => {
    setUpdateDefaultEmailIsLoading(true);
    console.log(defaultEmailMessage);
    const emailContentRef = doc(
      database,
      "emailcontent",
      "EoBZwNKSUVEfUmSA5knC"
    );
    await updateDoc(emailContentRef, {
      emailcontent: defaultEmailMessage,
    });
    setUpdateDefaultEmailIsLoading(false);
  };

  const handleDeletePost = async (id: string) => {
    await deleteDoc(doc(database, "blogs", id));
    location.reload();
  };

  return (
    <main>
      <div className="mx-auto  w-[95%] max-w-[900px]">
        <Card className="mx-auto max-w-3xl mt-16">
          <CardHeader className="w-full text-3xl font-bold text-center">
            {user.displayName ? user.displayName : "Roqeebat Bolarinwa"}
          </CardHeader>
          <CardContent className="flex mx-auto w-fit gap-8">
            <Link
              className="flex items-center gap-2"
              href={"/create"}
              title="Create Blog"
            >
              <LucideBook /> <p>Create Blog</p>
            </Link>
            <Link
              className="flex items-center gap-2"
              href={"/drafts"}
              title="Drafts"
            >
              <BookMinus /> <p>Check Drafts</p>
            </Link>
          </CardContent>
          <Card className="h-48 max-w-[95%] mx-auto justify-center flex mb-5 relative ">
            <Dialog>
              <DialogTrigger className="mt-auto mb-4 border-accent border hover:bg-accent h-fit p-2 rounded-md hover:text-white transition-colors duration-200 font-medium">
                View all subscribers
              </DialogTrigger>
              <DialogContent>
                <Card className="mt-4 ">
                  <CardContent className="mt-5">
                    {subscribers ? (
                      subscribers.map((subscriber) => (
                        <div key={subscriber.email} className="mb-4">
                          <p className=" text-xl font-bold  text-clip">
                            {subscriber.email}
                          </p>
                          <p>{moment(subscriber.date_subscribed).fromNow()}</p>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
            <div className="text-left absolute -z-10 top-0 left-0 w-full h-full p-5 backdrop-blur-sm">
              {subscriberLoading && subscribers.length === 0 ? (
                <RotateCw className="animate-spin" size={30} />
              ) : (
                <p className="text-4xl font-bold">
                  {subscribers ? subscribers.length : 0}
                </p>
              )}
              <p className="text-sm max-w-48 mt-2 text-opacity-80">
                Total number of people subscribed to the blog
              </p>
            </div>

            <div className="right-0 bottom-0 absolute -z-20 overflow-clip max-h-[150px]">
              {subscribers ? (
                subscribers.map((subscriber) => (
                  <div key={subscriber.email}>
                    <p className="lg:text-3xl text-xl font-medium text-clip">
                      {subscriber.email}
                    </p>
                    <p>{moment(subscriber.date_subscribed).fromNow()}</p>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </Card>
          <Card className="h-48 max-w-[95%] mx-auto justify-center flex mb-5 relative ">
            <Dialog>
              <DialogTrigger className="mt-auto mb-4 border-accent border hover:bg-accent h-fit p-2 rounded-md hover:text-white transition-colors duration-200 font-medium">
                View all blogs
              </DialogTrigger>
              <DialogContent className="max-w-[95%] md:max-w-3xl rounded-md  max-h-[500px] md:max-h-[500px]  overflow-y-scroll">
                <Card className="mt-4 border-none ">
                  <CardContent className="mt-5 ">
                    {blogs ? (
                      blogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="mb-8 flex justify-between items-baseline "
                        >
                          <div className="w-4/5 flex flex-col gap-1">
                            <p className=" text-lg font-bold font-gambarino text-clip ">
                              {blog.title}
                            </p>
                            <div className="flex gap-2">
                              <Link href={`/post/${blog.id}`}>
                                <LucideEye />
                              </Link>
                              <Dialog>
                                <DialogTrigger
                                // onClick={() => handleDeletePost(blog.id!)}
                                >
                                  <LucideTrash2 />
                                </DialogTrigger>
                                <DialogContent className="max-w-[300px]">
                                  <DialogTitle className="mt-3">
                                    Are you absolutely sure?
                                  </DialogTitle>
                                  <DialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete your blog post and remove
                                    your data from our servers.
                                  </DialogDescription>
                                  <DialogFooter className="flex justify-between mt-8">
                                    <DialogClose
                                      asChild
                                      className="mt-2 md:mt-0"
                                    >
                                      <Button variant="outline">Cancel</Button>
                                    </DialogClose>
                                    <Button
                                      variant="secondary"
                                      className="bg-red-500 text-white"
                                      onClick={() =>
                                        handleDeletePost(blog.id ? blog.id : "")
                                      }
                                    >
                                      Yes, delete
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>

                          <p className="text-sm w-1/5 text-right">
                            {" "}
                            {moment
                              .unix(Number.parseInt(blog.date_created) / 1000)
                              .format("MMMM D, YYYY")}
                          </p>
                        </div>
                      ))
                    ) : (
                      <></>
                    )}
                  </CardContent>
                </Card>
              </DialogContent>
            </Dialog>
            <div className="text-left absolute -z-10 top-0 left-0 w-full h-full p-5 backdrop-blur-sm">
              {blogLoading && blogs.length === 0 ? (
                <RotateCw className="animate-spin" size={30} />
              ) : (
                <p className="text-4xl font-bold">{blogs ? blogs.length : 0}</p>
              )}
              <p className="text-sm max-w-48 mt-2 text-opacity-80">
                Total number of published blogs
              </p>
            </div>
            <div className="right-60 bottom-0 absolute -z-20 overflow-clip max-h-[150px]">
              {blogs ? (
                blogs.slice(0, 2).map((blog) => (
                  <div key={blog.id}>
                    <p className="lg:text-3xl text-xl font-medium text-clip">
                      {blog.title}
                    </p>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </Card>
          <Card className="flex border-none">
            <Dialog>
              <DialogTrigger className="w-fit border p-3 rounded-md mb-2 mx-auto">
                Edit email content
              </DialogTrigger>
              <DialogContent>
                <p className="mt-6 mb-0 text-center text-sm">
                  (NOTE): Keep the email simple, describing whatever it is your
                  new blog post entails. There will be a link to the blog post
                  inserted at the bottom of your message, so you should probably
                  end your custom message with &apos;Here is the link to my blog
                  post&apos;
                </p>
                <textarea
                  className="border resize-none h-48 p-4 border-accent "
                  defaultValue={defaultEmailMessage}
                  onChange={(e) => setDefaultEmailMessage(e.target.value)}
                />
                <Button
                  className=" p-3 py-2 bg-accent text-white  rounded-md"
                  onClick={() => updateEmailContent()}
                  disabled={updateDefaultEmailIsLoading}
                >
                  {updateDefaultEmailIsLoading ? (
                    <RotateCw className="animate-spin" />
                  ) : (
                    "Save"
                  )}
                </Button>
              </DialogContent>
            </Dialog>
          </Card>
        </Card>
      </div>
    </main>
  );
}
export default withAuth(Page);
