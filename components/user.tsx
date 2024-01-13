"use client";
import { UserAuth } from "@/app/context/AuthContext";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Skill, skills } from "@/data/lurn";
import { SkillArtwork } from "./artwork";
import { AddSheet } from "./add_lurn";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import { SkillPageCard } from "./lurn_page";
import { Icons } from "./assets/icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "@/app/config";

export const UserComponent = () => {
  const { user } = UserAuth();
  const userSkillsRef = collection(database, "user_skills");
  const [selectedSkill, setSelectedSkill] = useState({ name: "", level: "" });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  useEffect(() => {
    const getSkills = async () => {
      const q = query(userSkillsRef, where("user_id", "==", user.uid));
      const skillSnap = await getDocs(q);
      if (!skillSnap.empty) {
        setUserSkills(skillSnap.docs[0].data().skills);
      }
    };
    getSkills();
  }, []);

  const [lurnPage, setLurnPage] = useState();

  const handleLurn = async () => {
    // Logic for calling the lurn api here
    // const url = "api/createMessage";
    //
    // const res = await axios.post(url, {
    //   messages: [
    //     {
    //       role: "system",
    //       content: `You are a ${selectedSkill.name} expert.`,
    //     },
    //     {
    //       role: "user",
    //       content: `I consider myself at a ${selectedSkill.level} level and I want to learn more about ${selectedSkill.name}, can you tell me what I should learn next`,
    //     },
    //   ],
    // });

    const googleUrl = "api/getGoogleData";

    const googleRes = await axios.get(googleUrl, {
      params: {
        q: "guitar beginner",
      },
    });

    console.log(googleRes.data.data);

    setLurnPage(googleRes.data.data);

    // console.log(res.data.data.choices[0].message.content);
  };
  return (
    <div className="flex flex-col  space-y-2">
      <div>
        <h2 className="text-2xl font-bold tracking-tight pt-2">
          Welcome back{" "}
          <span className="dark:text-cyan-400 text-blue-500 dark:drop-shadow-[0_0_2px_cyan] drop-shadow-md">
            {user.displayName}
          </span>
        </h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for the day!
        </p>
      </div>
      <Separator className="my-4" />
      <div className="mr-auto mr-4">
        <AddSheet />
      </div>
      <div className="flex justify-center">
        <div className="">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {userSkills.map((skill) => (
                <SkillArtwork
                  key={skill.name}
                  skill={skill}
                  className={`w-[150px] ${
                    selectedSkill.name == skill.skill_name
                      ? "border-b-2 dark:drop-shadow-[0_1px_5px_cyan] drop-shadow-[0_1px_5px_blue] "
                      : ""
                  }`}
                  aspectRatio="square"
                  width={150}
                  height={150}
                  onClick={() =>
                    setSelectedSkill({
                      name: skill.skill_name,
                      level: skill.level,
                    })
                  }
                />
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div onClick={handleLurn}>Lurn</div>
      <div>
        {lurnPage && (
          <Suspense
            fallback={<Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          >
            <div className="grid grid-cols-4">
              <SkillPageCard
                page={lurnPage}
                className="col-start-2 col-span-2"
                aspectRatio="landscape"
              />
            </div>
          </Suspense>
        )}
      </div>
    </div>
  );
};
