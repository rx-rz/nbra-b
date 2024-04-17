"use client";

import { useGetBlogs } from "@/lib/get-blogs";
import {
  LucideFileWarning,
  LucideInstagram,
  LucideLinkedin,
  LucideTwitter,
  RotateCw,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Search from "./components/search";

export default function Home() {
  const { blogs, blogError } = useGetBlogs();
  return (
    <main className="p-3">
      {blogError && !blogs && (
        <>
          <div className="w-fit mx-auto mt-4 text-center ">
            <LucideFileWarning className="animate-spin mb-2" />
            <p>Could not fetch blogs. Please refresh.</p>
          </div>
        </>
      )}
      {blogs && blogs.length > 0 ? (
        <>
          <div className=" h-full rounded-md md:p-3  mb-4 border-accent">
            {blogs[0] ? (
              <div className="md:block hidden">
                <Image
                  alt={blogs[0].title}
                  className="w-full h-[600px] object-cover mt-8 border-2 border-accent"
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
                            <button className="mx-1  text-xs hover:underline decoration-accent underline-offset-2 cursor-pointer">
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
                    <p className="xl:text-5xl text-3xl lg:text-4xl text-accent font-bold mt-1 font-gambarino">
                      {blogs[0].title}
                    </p>
                  </div>
                  <div className="max-w-2xl mx-auto lg:mt-4 mb-12 text-center">
                    <p className="lg:text-lg text-md my-1 mb-4">
                      {blogs[0].subtitle}
                    </p>
                    <Link
                      href={`/post/${blogs[0].id}`}
                      className="bg-accent text-white px-3 py-2 lg:text-md text-sm mt-3 rounded-3xl "
                    >
                      Read Blog
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
          <main className="grid lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3">
            {blogs &&
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="mb- flex flex-col justify-between border border-accent roundedmd p-5"
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
                    <p className="text-2xl mt-1 mb-1 font-gambarino text-accent font-bold">
                      {blog.title}
                    </p>
                    <p className="text-sm text-opacity-75 mb-3">
                      {blog.subtitle}
                    </p>
                    <Link
                      href={`/post/${blog.id}`}
                      className="bg-accent text-white px-3 py-2 text-xs rounded-3xl"
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
            <div className="border flex flex-col p-5 bg-accent rounded-md min-h-96">
              <p className="font-gambarino text-3xl md:text-4xl text-white leading-snug">
                Hello! <br />
                I am Roqeebat Bolarinwa.
                <br /> Interested in connecting? <br />
                Reach out to me via my social media channels:
              </p>
              <div className="md:mt-auto mt-16 flex gap-6 ">
                <Link href={"https://www.linkedin.com/in/roqeebatbolarinwa"}>
                  <LucideLinkedin stroke="#fff" />
                </Link>
                <Link href={"https://x.com/rtbolarinwa"}>
                  <LucideTwitter stroke="#fff" />
                </Link>
                <Link
                  href={
                    "https://www.instagram.com/roqeebatbolarinwa?igsh=MWFpOThkOTBodW5vOQ%3D%3D&utm_source=qr"
                  }
                >
                  <LucideInstagram stroke="#fff" />
                </Link>
              </div>
            </div>
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
