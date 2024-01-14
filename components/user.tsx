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
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "@/app/config";
import { parseToArrays } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Button } from "./ui/button";

export const UserComponent = () => {
  const { user } = UserAuth();
  const userSkillsRef = collection(database, "user_skills");
  const [selectedSkill, setSelectedSkill] = useState({ name: "", level: "" });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [lurnPages, setLurnPages] = useState([]);
  const [count, setCount] = useState({ total: 0, done: 0 });
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const getSkills = async () => {
      const q = query(userSkillsRef, where("user_id", "==", user.uid));
      const skillSnap = await getDocs(q);
      if (!skillSnap.empty) {
        setUserSkills(skillSnap.docs[0].data().skills);
      }
    };
    const getPoints = async () => {
      const docRef = doc(database, "user_points", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPoints(docSnap.data()["points"]);
      } else {
        setDoc(docRef, {
          points: 0,
        });
      }
    };
    getSkills();
    getPoints();
  }, []);

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
      const current = values[0].slice(0, 2) as any[];
      const done = values[1] as any[];
      const googleUrl = "api/getGoogleData";
      const _count = { total: current.length, done: 0 };

      const _lurnPages = [];
      for (const plan of current) {
        const isCompletedPlan = done.indexOf(plan) !== -1;
        if (isCompletedPlan) {
          _count.done += 1;
        }
        const googleRes = await axios.get(googleUrl, {
          params: {
            q: plan,
          },
        });

        const curLurnPage = {
          ...googleRes.data.data,
          plan: plan,
          skill: selectedSkill,
          completedPlan: isCompletedPlan,
          points: done.length * 5 + 10,
        };
        _lurnPages.push(curLurnPage);
      }

      setCount(_count);

      setLurnPages(_lurnPages);
      console.log(_lurnPages);
    });
  };

  const handleAdd = async (skill: Skill) => {
    const q = query(userSkillsRef, where("user_id", "==", user.uid));

    const skillSnap = await getDocs(q);
    const curSkills = userSkills.slice();
    curSkills.push(skill);
    setUserSkills(curSkills);

    if (skillSnap.empty) {
      addDoc(userSkillsRef, {
        user_id: user.uid,
        skills: [
          {
            description: skill.description,
            image: skill.image,
            name: skill.name,
            level: skill.level,
          },
        ],
      });
    } else {
      const skillRef = doc(database, "user_skills", skillSnap.docs[0].id);
      await updateDoc(skillRef, {
        skills: arrayUnion({
          description: skill.description,
          image: skill.image,
          name: skill.name,
          level: skill.level,
        }),
      });
    }
  };

  const handleUpgradeSkill = async () => {
    const q = query(userSkillsRef, where("user_id", "==", user.uid));
    const skillSnap = await getDocs(q);
    let currentId = 0;
    const currentSkill = userSkills.find((v, idx) => {
      if (v.name == selectedSkill.name) {
        currentId = idx;
      }
      return v.name == selectedSkill.name;
    });

    const newSkill = {
      ...currentSkill,
      level: currentSkill?.level == "Beginner" ? "Intermediate" : "Advanced",
    };

    const newCurSkills = userSkills.slice();
    newCurSkills.splice(currentId, 1, newSkill);

    setUserSkills(newCurSkills);
    if (!skillSnap.empty) {
      const skillRef = doc(database, "user_skills", skillSnap.docs[0].id);
      await updateDoc(skillRef, {
        skills: arrayRemove(currentSkill),
      });
      await updateDoc(skillRef, {
        skills: arrayUnion(newSkill),
      });
    }
  };

  const handleDone = async (lurn: { title: string; points: number }) => {
    const docRef = doc(database, "user_points", user.uid);
    const docSnap = await getDoc(docRef);
    let currentId = lurnPages.findIndex((e) => {
      return e.title === lurn.title;
    });
    const newLurnPages: any[] = lurnPages.slice();
    const newLurnPage = { ...newLurnPages[currentId], completedPlan: true };
    newLurnPages.splice(currentId, 1, newLurnPage);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        points: docSnap.data()["points"] + lurn.points,
      });
    }

    setPoints((point) => point + lurn.points);

    setLurnPages(newLurnPages);
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
        <div className="text-3xl font-light text-amber-400">🏅 {points}</div>
        <p className="text-muted-foreground">
          How about we learn something new today or just get better at
          somethingg
        </p>
      </div>
      <Separator className="my-4" />
      <div className="mr-auto mr-4">
        <AddSheet handleAdd={handleAdd} />
      </div>
      <div className="flex justify-center gap-5 items-center">
        <Progress
          value={count.total == 10 ? 0 : (count.done / count.total) * 100}
          className="w-[60%] h-[10px]"
        />
        <Button
          variant={`${
            count.done == count.total &&
            count.done > 0 &&
            selectedSkill.name != ""
              ? "default"
              : "secondary"
          }`}
          onClick={() => {
            if (
              count.done == count.total &&
              count.done > 0 &&
              selectedSkill.name != ""
            ) {
              handleUpgradeSkill();
            }
          }}
        >
          Upgrade
        </Button>
      </div>
      <div className="flex justify-center">
        <div className="">
          <ScrollArea>
            <div className="flex space-x-4 p-4">
              {userSkills.map((skill) => (
                <SkillArtwork
                  readonly={false}
                  key={skill.name + skill.level}
                  skill={skill}
                  className={`w-[150px] ${
                    selectedSkill.name == skill.name
                      ? "dark:drop-shadow-[0_1px_5px_cyan] drop-shadow-[0_1px_5px_blue] "
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
      <div onClick={handleLurn}>
        <div className="mb-4">
          <button
            type="button"
            className="flex justify-center max-w-sm w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-green-400 transition-all hover:cursor-pointer focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-full mx-auto p-5"
            style={{ opacity: selectedSkill.name == "" ? 0.5 : 1 }}
            disabled={selectedSkill.name == ""}
          >
            <div className="flex justify-center items-center">
              <div className="col-span-2 pt-2">lurn</div>
            </div>
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <ScrollArea className="rounded-md border p-5">
          <div className="grid grid-cols-3 gap-5 gap-y-10">
            {lurnPages &&
              lurnPages.map((page) => (
                <div
                  key={page.title + page.skill}
                  className={`${
                    page.completedPlan
                      ? "bg-gradient-to-r from-green-800 to-green-500 p-[0.25rem] rounded-lg "
                      : ""
                  }`}
                >
                  <SkillPageCard
                    key={page.title + page.skill}
                    completed={page.completedPlan}
                    handleDone={handleDone}
                    page={page}
                    className={`col-span-1 bg-background h-[30vh]`}
                    aspectRatio="landscape"
                  />
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
