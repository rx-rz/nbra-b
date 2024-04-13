"use client";
import Editor from "../components/editor";
import { Suspense } from "react";

import { RotateCw } from "lucide-react";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-fit mx-auto mt-4">
          <RotateCw className="animate-spin" />
        </div>
      }
    >
      <div>
        <Editor />
      </div>
    </Suspense>
  );
}
