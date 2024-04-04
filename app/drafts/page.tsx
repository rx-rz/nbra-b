"use client";
import { useGetDrafts } from "@/lib/get-drafts";
import { BookMinus, Home, SearchIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Page() {
  const { drafts } = useGetDrafts();
  return (
    <div>
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
      <main className="grid grid-cols-3 gap-x-4 gap-y-3 mt-4 p-3">
        {drafts &&
          drafts.map((draft) => (
            <div
              key={draft.id}
              className="mb- flex flex-col justify-between border rounded-md p-5"
            >
              <div>
                <p>
                  [
                  {draft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="mx-1 text-xs hover:underline underline-offset-2 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                  ]
                </p>
                <p className="text-2xl mt-1 mb-1 font-gambarino font-bold">
                  {draft.title}
                </p>
                <p className="text-sm text-opacity-75 mb-3">{draft.subtitle}</p>
                <Link
                  href={`/create?draft_id=${draft.id}`}
                  className="bg-black text-white px-3 py-2 text-xs rounded-3xl"
                >
                  Edit Draft
                </Link>
              </div>
              <Image
                alt={draft.title}
                className="w-full h-[250px] object-cover mt-8 border"
                width={1000}
                height={500}
                src={draft.header_image}
              />
            </div>
          ))}
      </main>
    </div>
  );
}
