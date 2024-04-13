"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "../store/auth_store";
import Link from "next/link";
import { BookMinus, LucideBook } from "lucide-react";
import { useGetSubscribers } from "@/lib/get-subscribers";
import moment from "moment";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";

export default function Page() {
  const { user } = useAuthStore();
  const { subscribers } = useGetSubscribers();
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
              <DialogTrigger className="mt-auto mb-3 ">
                <Button className="border-accent border hover:bg-accent hover:text-white transition-colors duration-200 font-medium">
                  View all subscribers
                </Button>
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
              <p className="text-4xl font-bold">
                {subscribers ? subscribers.length : 0}
              </p>
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
        </Card>
      </div>
    </main>
  );
}
