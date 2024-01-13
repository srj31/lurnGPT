import { Metadata } from "next";
import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainNav } from "@/components/main-nav";
import { Overview } from "@/components/overview";
import { Search } from "@/components/search";
import { UserNav } from "@/components/user-nav";
import { UserComponent } from "./user";
import { Suspense } from "react";
import { Icons } from "./assets/icons";
import { Progress } from "./progress";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app built using the components.",
};

export default function DashboardPage() {
  return (
    <>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <Tabs defaultValue="user_page" className="space-y-4">
            <TabsList>
              <TabsTrigger value="user_page">User</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
            </TabsList>
            <TabsContent value="user_page" className="space-y-4">
              <Suspense
                fallback={
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                }
              >
                <UserComponent />
              </Suspense>
            </TabsContent>
            <TabsContent value="overview" className="space-y-4">
              <Overview />
            </TabsContent>
            <TabsContent value="progress" className="space-y-4">
              <Progress />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
