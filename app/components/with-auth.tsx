"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth_store";
import Link from "next/link";

const withAuth = <P extends object>(Component: React.ComponentType<P>) => {
  const AuthenticatedComponent = ({ ...props }: P) => {
    const { user } = useAuthStore();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      if (user && user.email && user.uid) {
        setIsAuthenticated(true);
      }
    }, [user]);
    if (!isAuthenticated) {
      return (
        <div className="text-center py-10 text-3xl">
          <h1 className="text-9xl font-gambarino">402</h1>
          <p className="mb-4">You need to be logged in to access this page.</p>
          <Link className="text-base p-3 border rounded-lg border-accent hover:text-white hover:bg-accent" href={"/"}>
            Go to home
          </Link>
        </div>
      );
    }

    return <Component {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
