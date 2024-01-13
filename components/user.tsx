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
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { database } from "@/app/config";
import { parseToArrays } from "@/lib/utils";

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

  const getPlan = async () => {
    const key = selectedSkill.name + "_" + selectedSkill.level;
    const docRef = doc(database, "user_plan", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().data;
    } else {
      const url = "api/createMessage";
      const res = await axios.post(url, {
        messages: [
          {
            role: "system",
            content: `You are a ${selectedSkill.name} expert.`,
          },
          {
            role: "user",
            content: `I consider myself at a ${selectedSkill.level} level and I want to learn more about ${selectedSkill.name}, can you give me a plan for learning ${selectedSkill.level} level stuff with each learning expressed in a single line and only give me the bullet points and no other text`,
          },
        ],
      });
      const content = res.data.data.choices[0].message.content;
      const data = parseToArrays(content);
      setDoc(docRef, {
        data,
      });
      return data;
    }
  };

  const getCompletedPlans = async () => {
    const key = user.uid;
    const docRef = doc(database, "user_plans_done", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data()[selectedSkill.name] ?? [];
    } else {
      const obj: Record<string, string[]> = {};
      obj[selectedSkill.name] = [];
      return obj;
    }
  };

  const handleLurn = async () => {
    const currentPlan = getPlan();

    const completedPlans = getCompletedPlans();

    Promise.all([currentPlan, completedPlans]).then(async (values) => {
      const current = values[0] as any[];
      const done = values[1] as any[];
      const next = current.filter((plan) => done.indexOf(plan) === -1)[0];
      const googleUrl = "api/getGoogleData";

      const googleRes = await axios.get(googleUrl, {
        params: {
          q: next,
        },
      });

      setLurnPage({ ...googleRes.data.data, plan: next, skill: selectedSkill });
    });
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
                    selectedSkill.name == skill.name
                      ? "border-b-2 dark:drop-shadow-[0_1px_5px_cyan] drop-shadow-[0_1px_5px_blue] "
                      : ""
                  }`}
                  aspectRatio="square"
                  width={150}
                  height={150}
                  onClick={() =>
                    setSelectedSkill({
                      name: skill.name,
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
