"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { LucideLogIn } from "lucide-react";
import { useAuthStore } from "../store/auth_store";
import { auth } from "@/config/firebase-config";
import { useEffect } from "react";
import { useBlogStore } from "../store/blog_store";

export default function Page() {
  const googleProvider = new GoogleAuthProvider();
  const { setUser } = useAuthStore();
  const handleGoogleSubmit = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((result) => {
        setUser({
          displayName: result?.user?.displayName || "",
          email: result?.user?.email || "",
          photoUrl: result?.user?.photoURL || "",
          uid: result?.user?.uid || "",
        });
      });
      location.pathname = "/profile";
    } catch (err) {
      console.error(err);
    }
  };
  const { setDraftID } = useBlogStore();

  useEffect(() => {
    setDraftID("");
  }, [setDraftID]);

  return (
    <Card className="mx-auto max-w-sm mt-16">
      <CardHeader>
        <CardTitle className="text-2xl items-center">
          <span>Login</span> <LucideLogIn className="inline" />
        </CardTitle>
        <CardDescription>
          Enter your Google credentials to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Button
            variant="outline"
            className="w-full bg-accent text-white"
            onClick={() => handleGoogleSubmit()}
          >
            Login with Google
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
