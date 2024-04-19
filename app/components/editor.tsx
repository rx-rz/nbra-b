"use client";
import { Image as TiptapImage } from "@tiptap/extension-image";
import { database, storage } from "@/config/firebase-config";
import {
  BubbleMenu,
  FloatingMenu,
  useEditor,
  EditorContent,
} from "@tiptap/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import StarterKit from "@tiptap/starter-kit";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Image from "next/image";
import { TitleEditor } from "./title-editor";
import { TagsEditor } from "./tags-editor";
import { useBlogStore } from "@/app/store/blog_store";
import { Suspense, useEffect, useState } from "react";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import { toast } from "sonner";
import { Toaster } from "./ui/sonner";
import CharacterCount from "@tiptap/extension-character-count";
import { Loader2, RotateCw, UploadCloud } from "lucide-react";
import { useGetDraft } from "@/lib/get-draft";
import { useRouter, useSearchParams } from "next/navigation";

const Editor = () => {
  const searchParams = useSearchParams();
  const draft_id = searchParams.get("draft_id");
  const { draft } = useGetDraft({ id: draft_id });

  const {
    blog: storedBlog,
    setBlog: setStoredBlog,
    draftID,
    setDraftID,
  } = useBlogStore();
  const [blog, setBlog] = useState<BlogContent>();
  const [publishLoading, setPublishLoading] = useState(false);
  const [draftLoading, setDraftLoading] = useState(false);
  const [headerUploadPercentage, setHeaderUploadPercentage] = useState(0);
  const [headerImageText, setHeaderImageText] = useState(
    "Please upload an image."
  );
  const validateBlogContent = (blog: BlogContent | undefined) => {
    if (blog) {
      if (blog.content.length < 100) {
        toast("Minimum blog content length of 100 characters");
        return "error";
      } else if (blog?.header_image === "") {
        toast("No header image specified");
        return "error";
      } else if (blog?.subtitle === "") {
        toast("No subtitle for blog post.");
        return "error";
      } else if (blog?.title === "") {
        toast("Enter title for blog post");
        return "error";
      } else if (blog.tags.length < 1) {
        toast("Please add tags to the blog post.");
      }
      return "";
    }
    return "";
  };

  const editor = useEditor({
    extensions: [StarterKit, TiptapImage, CharacterCount],
    content: blog ? blog.content : "",
    onBlur: ({ editor }) => {
      setStoredBlog({ ...storedBlog, content: editor.getHTML() });
      handleDraft();
    },
    onCreate: ({ editor }) => {
      editor?.commands.setContent(storedBlog.content);
    },
  });

  useEffect(() => {
    if (draft) {
      setBlog(draft);
      setStoredBlog(draft);
      editor?.commands.setContent(draft.content);
    }
  }, [draft, setStoredBlog, editor]);

  useEffect(() => {
    setBlog(storedBlog);
  }, [storedBlog, editor]);

  const isActive =
    "bg-black [&>img]:invert rounded-full border border-black p-2 md:w-[30px] md:h-[30px] w-fit h-fit flex items-center justify-center";
  const isNotActive =
    "bg-white  rounded-full border-black border md:w-[30px] p-2 md:h-[30px] w-fit h-fit flex items-center justify-center";

  const imageUpload = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files![0];
      const formData = new FormData();
      formData.append("image", file);
      const storageRef = ref(storage, `/images/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Get the current editor state
      const currentChain = editor?.state.selection.anchor;

      // Add a placeholder image before the upload starts
      editor
        ?.chain()
        .insertContent(
          '<img src="https://placehold.co/600x400?text=Loading" class="placeholder"/>'
        )
        .run();

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // You can add progress tracking here if needed
        },
        (error) => {
          console.log(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            if (downloadUrl) {
              editor?.commands.focus(currentChain);
              editor?.commands.selectNodeBackward();
              editor?.commands.deleteNode("image");
              editor
                ?.chain()
                .setImage({
                  src: downloadUrl,
                  alt: file.name,
                  title: file.name,
                })
                .run();
            }
          });
        }
      );
    };

    editor?.setEditable(true);
  };

  const router = useRouter();

  const publishBlog = async () => {
    try {
      setPublishLoading(true);
      const isValid = validateBlogContent(storedBlog);
      if (isValid === "error") {
        setPublishLoading(false);
        return;
      }

      const newBlogData = {
        content: editor?.getHTML(),
        author: "Roqeebat Bolarinwa",
        date_created: moment.now().toString(),
        header_image: storedBlog.header_image,
        is_draft: false,
        subtitle: storedBlog.subtitle,
        tags: storedBlog.tags,
        title: storedBlog.title,
      };

      if (draftID.length !== 0) {
        const blogRef = doc(database, "blogs", draftID);
        await updateDoc(blogRef, newBlogData);
        await sendEmailToUsers(draftID);
      } else {
        const blogRef = await addDoc(
          collection(database, "blogs"),
          newBlogData
        );
        await sendEmailToUsers(blogRef.id);
      }

      setStoredBlog({
        content: "",
        author: "Roqeebat Bolarinwa",
        date_created: moment.now().toString(),
        header_image: "",
        is_draft: true,
        subtitle: "",
        tags: [],
        title: "",
      });

      setDraftID("");
      setPublishLoading(false);
      router.push("/");
    } catch (err) {
      setPublishLoading(false);
      console.error("Error publishing blog:", err);
      toast("Error publishing blog. Please try again later.");
    }
  };

  useEffect(() => {
    const url = new URL(location.href);
    url.searchParams.delete("draft_id");
    router.push(url.toString());
  }, [router]);
  const handleDraft = async () => {
    setDraftLoading(true);
    if (draftID) {
      const draftRef = doc(database, "blogs", draftID);
      const draftDoc = await getDoc(draftRef);
      if (draftDoc.exists() && blog) {
        await updateDoc(draftRef, {
          content: editor?.getHTML(),
          date_created: moment.now().toString(),
          header_image: blog.header_image,
          is_draft: true,
          subtitle: blog.subtitle,
          tags: blog.tags,
          title: blog.title,
        });
      }
    } else {
      if (blog)
        await addDoc(collection(database, "blogs"), {
          content: editor?.getHTML(),
          author: "Roqeebat Bolarinwa",
          date_created: moment.now().toString(),
          header_image: blog.header_image,
          is_draft: true,
          subtitle: blog.subtitle,
          tags: blog.tags,
          title: blog.title,
        }).then((value) => {
          setDraftID(value.id);
        });
    }
    setDraftLoading(false);
  };

  const uploadHeaderImage = () => {
    if (blog) {
      const input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.click();
      input.onchange = () => {
        const file = input.files![0];
        const formData = new FormData();
        formData.append("image", file);
        const storageRef = ref(storage, `/images/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percentage = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setHeaderUploadPercentage(percentage);
            setHeaderImageText(percentage.toString());
          },
          (error) => {
            toast("An error occured.", {
              description: error.message,
            });
            console.log(error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
              setHeaderUploadPercentage(0);
              setStoredBlog({ ...storedBlog, header_image: downloadUrl });
              setBlog({ ...storedBlog, header_image: downloadUrl });
              return "";
            });
          }
        );
      };
    }
  };

  const sendEmailToUsers = async (id: string) => {
    await fetch("/post", {
      method: "POST",
      body: JSON.stringify({
        subscribers: [
          "adeleyetemiloluwa.work@gmail.com",
          "adeleyetemiloluwa674@gmail.com",
        ],
        message: `<p>Hello. I just published a new blog post!. You can view it <a href="https://nbra-b.vercel.app/post/${id}">here.</a> </p></br>`,
      }),
    });
  };

  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto mt-4">
          <RotateCw className="animate-spin" />
        </div>
      }
    >
      <div className="relative">
        <>
          <Toaster />
        </>
        <div className="flex relative mb-16 ml-3 top-1 right-1 md:right-3 ">
          <div className="absolute top-3 md:right-3 right-0 flex">
            <button
              className="cursor-pointer bg-white border text-sm  rounded-md p-1 px-3"
              onClick={() => handleDraft()}
              disabled={draftLoading || publishLoading}
            >
              {draftLoading ? (
                <Loader2 size={20} className="animate-spin mx-auto" />
              ) : (
                "Save as draft"
              )}
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  className="cursor-pointer bg-black text-white border-black w-24 border text-sm rounded-md p-1 px-3 ml-4"
                  disabled={draftLoading || publishLoading}
                >
                  {publishLoading ? (
                    <Loader2 size={20} className="animate-spin mx-auto" />
                  ) : (
                    "Publish"
                  )}
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Publish blog?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. Please ensure you go through
                    your blog post for any necessary corrections to be made.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-red-500 text-white hover:bg-red-500">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-accent text-white"
                    onClick={() => publishBlog()}
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <>
          {editor && (
            <BubbleMenu
              className="bubble-menu flex gap-1 flex-wrap"
              tippyOptions={{ duration: 100 }}
              editor={editor}
            >
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={
                  editor.isActive("paragraph") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/paragraph.svg"}
                  alt="Paragraph"
                  className="w-[15px] h-[15px] object-cover"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? isActive : isNotActive}
              >
                <Image width={15} height={15} src={"/bold.svg"} alt="Bold" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? isActive : isNotActive}
              >
                <Image
                  width={15}
                  height={15}
                  src={"/italic.svg"}
                  alt="Italic"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={
                  editor.isActive("blockquote") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/blockquote.svg"}
                  alt="Blockquote"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={
                  editor.isActive("orderedList") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/orderedlist.svg"}
                  alt="Ordered List"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={
                  editor.isActive("bulletList") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/bulletlist.svg"}
                  alt="Bullet List"
                />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 })
                    ? isActive
                    : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/h1.svg"}
                  alt="Heading One"
                />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 })
                    ? isActive
                    : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/h2.svg"}
                  alt="Heading Two"
                />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 })
                    ? isActive
                    : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/h3.svg"}
                  alt="Heading Three"
                />
              </button>
            </BubbleMenu>
          )}
          {editor && (
            <FloatingMenu
              className="bubble-menu flex gap-1 flex-wrap"
              tippyOptions={{ duration: 100 }}
              editor={editor}
            >
              <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={
                  editor.isActive("paragraph") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/paragraph.svg"}
                  alt="Paragraph"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? isActive : isNotActive}
              >
                <Image width={15} height={15} src={"/bold.svg"} alt="Bold" />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? isActive : isNotActive}
              >
                <Image
                  width={15}
                  height={15}
                  src={"/italic.svg"}
                  alt="Italic"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={
                  editor.isActive("orderedList") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/orderedlist.svg"}
                  alt="Ordered List"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={
                  editor.isActive("blockquote") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/blockquote.svg"}
                  alt="Blockquote"
                />
              </button>
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={
                  editor.isActive("bulletList") ? isActive : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/bulletlist.svg"}
                  alt="Bullet List"
                />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={
                  editor.isActive("heading", { level: 1 })
                    ? isActive
                    : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/h1.svg"}
                  alt="Heading One"
                />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={
                  editor.isActive("heading", { level: 2 })
                    ? isActive
                    : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/h2.svg"}
                  alt="Heading Two"
                />
              </button>
              <button
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor.isActive("heading", { level: 3 })
                    ? isActive
                    : isNotActive
                }
              >
                <Image
                  width={15}
                  height={15}
                  src={"/h3.svg"}
                  alt="Heading Three"
                />
              </button>
              <button
                type="button"
                onClick={imageUpload}
                className={isNotActive}
              >
                <Image
                  width={15}
                  height={15}
                  src={"/image.svg"}
                  alt="Upload Image"
                />
              </button>
            </FloatingMenu>
          )}
          <button
            className="cursor-pointer font-bold text-sm w-full text-opacity-70"
            onClick={() => uploadHeaderImage()}
          >
            {blog?.header_image ? (
              <div className="relative max-h-[600px] border-2  h-full">
                {headerUploadPercentage > 0 ? (
                  <p className="absolute text-3xl font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {headerUploadPercentage} %
                  </p>
                ) : (
                  <></>
                )}

                <Image
                  src={blog.header_image}
                  alt="Header Image"
                  width={1000}
                  height={500}
                  className="object-cover w-full max-h-[600px]"
                />
              </div>
            ) : (
              <div className="w-screen h-[600px] font-switzer  border-dotted border-2 flex items-center justify-center text-opacity-65">
                {headerUploadPercentage > 0 ? (
                  <p className="absolute text-3xl font-bold top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    {headerUploadPercentage} %
                  </p>
                ) : (
                  <div className="flex flex-col gap-4">
                    <UploadCloud size={200} />
                    <p className="opacity-75">Please upload an image.</p>
                  </div>
                )}
              </div>
            )}
          </button>
          <div className="mx-4">
            <TitleEditor
              blog={blog}
              setStoredBlog={setStoredBlog}
              storedBlog={storedBlog}
              setBlog={setBlog}
            />
            <TagsEditor
              blog={blog}
              setStoredBlog={setStoredBlog}
              storedBlog={storedBlog}
              setBlog={setBlog}
            />
            <div className="max-w-[66ch] mx-auto">
              <EditorContent
                editor={editor}
                className="focus:outline-none  focus:border-none  mb-2 text-justify"
              />
              <div className="flex gap-4 text-right justify-end text-xs mb-4 sticky bottom-2">
                <p>
                  <span className="font-bold">
                    {editor?.storage.characterCount.characters()}
                  </span>{" "}
                  characters
                </p>
                <p>
                  <span className="font-bold">
                    {editor?.storage.characterCount.words()}
                  </span>{" "}
                  words
                </p>
              </div>
            </div>
          </div>
        </>
      </div>
    </Suspense>
  );
};

export default Editor;
