"use client";
import { UserAuth } from "@/app/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";

export function AuthTabs() {
  const { signUp, logIn } = UserAuth();

  const [signInUserName, setSignInUserName] = useState("");
  const [signInUser, setSignInUser] = useState("");
  const [signUpUser, setSignUpUser] = useState("");
  const [signInPass, setSignInPass] = useState("");
  const [signUpPass, setSignUpPass] = useState("");

  const handleLogin = async () => {
    try {
      await logIn(signInUser, signInPass);
    } catch (e) {
      console.log(e);
    }
  };
  const handleSignUp = async () => {
    try {
      await signUp(signUpUser, signUpPass, signInUserName);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div className="flex flex-col items-center justify-around">
      <div className="container relative hidden h-[800px] flex-col items-center justify-between md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            LurnGPT
          </div>
          <div className="z-20">
            <img
              className="rounded-lg p-10"
              style={{ filter: "invert(1)" }}
              src="/images/home.svg"
            />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Anyone who stops learning is old, whether at twenty or
                eighty. Anyone who keeps learning stays young. The greatest
                thing in life is to keep your mind young.&rdquo;
              </p>
              <footer className="text-sm">Henry Ford</footer>
            </blockquote>
          </div>
        </div>
        <Tabs defaultValue="login" className="w-[35rem] pl-[10rem]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <div className="w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Login</CardTitle>
                  <CardDescription>
                    Login with your existing account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email"
                      onChange={(e) => setSignInUser(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password"
                      onChange={(e) => setSignInPass(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleLogin}>Login</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Signup</CardTitle>
                <CardDescription>
                  Create an account with your email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="username"
                    placeholder="Username"
                    onChange={(e) => setSignInUserName(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    onChange={(e) => setSignUpUser(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setSignUpPass(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSignUp}>Signup</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
