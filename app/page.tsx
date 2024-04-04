"use client";

import { useGetBlogs } from "@/lib/get-blogs";
import {
  BookMinus,
  HomeIcon,
  LucideBook,
  Rotate3D,
  RotateCw,
  SearchIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Search from "./components/search";

export default function Home() {
  const { blogs } = useGetBlogs();

  return (
    <main className="p-3">
      {/* <header className="flex justify-between mt-3 mx-3 text-xs border-b pb-2">
        <Link
          href={"/"}
          className="font-bold flex gap-1 items-center font-gambarino"
        >
          <HomeIcon fill="#000" stroke="#fff" />
          <div className="leading-3">
            <p>roqeebatu</p>
            <p>abeni</p>
          </div>
        </Link>
        <div className="flex gap-4">
          <Link href={"/create"} title="Create Blog">
            <LucideBook />
          </Link>
          <Link href={"/drafts"} title="Drafts">
            <BookMinus />
          </Link>
          <Dialog>
            <DialogTrigger title="Search">
              <SearchIcon />
            </DialogTrigger>
            <DialogContent className="max-h-[700px] h-[100%] w-[95%] md:w-[80%] max-w-[1000px] overflow-y-scroll">
              <Search blogs={blogs} />
            </DialogContent>
          </Dialog>
        </div>
      </header> */}
      {blogs && blogs.length > 0 ? (
        <>
          <div className=" h-full rounded-md p-3">
            {blogs[0] ? (
              <>
                <Image
                  alt={blogs[0].title}
                  className="w-full h-[600px] object-cover mt-8"
                  width={1000}
                  height={500}
                  src={blogs[0].header_image}
                />
                <div className="text-center justify-between">
                  <div>
                    <div className="mt-1">
                      [
                      {blogs[0].tags.map((tag) => (
                        <Dialog key={tag}>
                          <DialogTrigger>
                            <button className="mx-1  text-xs hover:underline underline-offset-2 cursor-pointer">
                              {tag}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[700px] h-[100%] w-[95%] md:w-[80%] max-w-[1000px] overflow-y-scroll">
                            <Search blogs={blogs} tag={tag} />
                          </DialogContent>
                        </Dialog>
                      ))}
                      ]
                    </div>
                    <p className="xl:text-5xl text-3xl lg:text-4xl  font-bold mt-1 font-gambarino">
                      {blogs[0].title}
                    </p>
                  </div>
                  <div className="max-w-2xl mx-auto lg:mt-4 mb-12 text-center">
                    <p className="lg:text-lg text-md my-1 mb-4">
                      {blogs[0].subtitle}
                    </p>
                    <Link
                      href={`/post/${blogs[0].id}`}
                      className="bg-black text-white px-3 py-2 lg:text-md text-sm mt-3 rounded-3xl "
                    >
                      Read Blog
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
          <main className="grid lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3">
            {blogs &&
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="mb- flex flex-col justify-between border rounded-md p-5"
                >
                  <div>
                    <div>
                      [
                      {blog.tags.map((tag) => (
                        <Dialog key={tag}>
                          <DialogTrigger>
                            <button className="mx-1 text-xs hover:underline underline-offset-2 cursor-pointer">
                              {tag}
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[700px] h-[100%] w-[95%] md:w-[80%] max-w-[1000px] overflow-y-scroll">
                            <Search blogs={blogs} tag={tag} />
                          </DialogContent>
                        </Dialog>
                      ))}
                      ]
                    </div>
                    <p className="text-2xl mt-1 mb-1 font-gambarino font-bold">
                      {blog.title}
                    </p>
                    <p className="text-sm text-opacity-75 mb-3">
                      {blog.subtitle}
                    </p>
                    <Link
                      href={`/post/${blog.id}`}
                      className="bg-black text-white px-3 py-2 text-xs rounded-3xl"
                    >
                      Read Blog
                    </Link>
                  </div>
                  <Image
                    alt={blog.title}
                    className="w-full h-[250px] object-cover mt-8"
                    width={1000}
                    height={500}
                    src={blog.header_image}
                  />
                </div>
              ))}
          </main>
        </>
      ) : (
        <>
          <div className="w-fit mx-auto mt-4">
            <RotateCw className="animate-spin" />
          </div>
        </>
      )}
    </main>
  );
}
