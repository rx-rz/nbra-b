"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { database } from "@/config/firebase-config";
import { useGetDrafts } from "@/lib/get-drafts";
import { deleteDoc, doc } from "firebase/firestore";
import { LucideAnnoyed, RotateCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

export default function Page() {
  const { drafts } = useGetDrafts();
  const handleDeleteDraft = async (draftId: string) => {
    await deleteDoc(doc(database, "blogs", draftId));
    location.reload();
  };
  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto mt-4">
          <RotateCw className="animate-spin" />
        </div>
      }
    >
      <div>
        {drafts && drafts.length > 0 ? (
          <main className="grid lg:grid-cols-2 grid-cols-1 xl:grid-cols-3 gap-x-4 gap-y-3 p-3">
            {drafts.map((draft) => (
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
                  <p className="text-sm text-opacity-75 mb-3">
                    {draft.subtitle}
                  </p>
                  <div className="flex gap-2">
                    <Link
                      href={`/create?draft_id=${draft.id}`}
                      className="bg-black text-white px-3 py-2 text-xs rounded-3xl"
                    >
                      Edit Draft
                    </Link>
                    <Dialog>
                      <DialogTrigger>
                        <button className="bg-red-500 text-white px-3 py-2 text-xs rounded-3xl">
                          Delete Draft
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle className="mt-3">
                          Are you absolutely sure?
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your draft and remove your data from our
                          servers.
                        </DialogDescription>
                        <DialogFooter className="flex justify-between mt-8">
                          <DialogClose asChild className="mt-2 md:mt-0">
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button
                            variant="secondary"
                            className="bg-red-500 text-white"
                            onClick={() =>
                              handleDeleteDraft(draft.id ? draft.id : "")
                            }
                          >
                            Yes, delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
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
        ) : (
          <>
            <div className="w-fit mx-auto  mt-8">
              <LucideAnnoyed size={40} className="mx-auto" />
              <p className="mt-4">No drafts currently.</p>
            </div>
          </>
        )}
      </div>
    </Suspense>
  );
}
