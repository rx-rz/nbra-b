"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useAuthStore } from "../store/auth_store";
import Link from "next/link";
import { BookMinus, LucideBook } from "lucide-react";

export default function Page() {
  const { user } = useAuthStore();
  return (
    <main>
      <div className="mx-auto  w-fit">
        <Card className="mx-auto max-w-3xl mt-16">
          <CardHeader className="w-full">Roqeebat Bolarinwa</CardHeader>
          <CardContent className="flex mx-auto w-fit gap-8">
            <Link href={"/create"} title="Create Blog">
              <LucideBook />
            </Link>
            <Link href={"/drafts"} title="Drafts">
              <BookMinus />
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
