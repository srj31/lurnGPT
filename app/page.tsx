"use client";
import React, { useEffect, useState } from "react";
import { UserAuth } from "./context/AuthContext";
import { AuthTabs } from "@/components/auth";
import Home from "@/components/home";
import { Icons } from "@/components/assets/icons";

const page = () => {
  const { user } = UserAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <div className="h-screen w-screen">
      {loading ? (
        <div className="flex h-full w-full justify-center items-center text-lg text-muted-foreground">
          <Icons.spinner className="mr-4 h-[2rem] w-[2rem] animate-spin" />
          Loading...
        </div>
      ) : user ? (
        <Home />
      ) : (
        <div>
          <AuthTabs />
        </div>
      )}
    </div>
  );
};

export default page;
