"use client";
import { UserAuth } from "@/app/context/AuthContext";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Skill } from "@/data/lurn";
import { SkillArtwork } from "./artwork";
import { AddSheet } from "./add_lurn";
import { useEffect, useState } from "react";
import axios from "axios";
import { SkillPageCard } from "./lurn_page";
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
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "recharts";
import { Input } from "./ui/input";
import { CheckIcon } from "@radix-ui/react-icons";

const EditPlans = ({
  plans,
  handleEdit,
}: {
  plans: any[];
  handleEdit: (plans: any[]) => void;
}) => {
  const [currentPlan, setPlan] = useState(plans);

  const handleSubmit = () => {
    console.log(currentPlan);
    const filteredPlans = currentPlan.filter((e) => e.plan.length > 0);
    setPlan(filteredPlans);
    handleEdit(filteredPlans);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Plans</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit plan</DialogTitle>
          <DialogDescription>
            Make the change in plan you think should work
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[80vh]">
          <div className="grid gap-4 py-4">
            {currentPlan.map((e: any, i: number) => (
              <div className="grid grid-cols-4 items-center" key={currentPlan[i].plan}>
                <Input
                  id="name"
                  value={currentPlan[i].plan}
                  className="col-span-3"
                  onChange={(e) => {
                    currentPlan[i].plan = e.target.value;
                    setPlan([...currentPlan]);
                  }}
                />
                {currentPlan[i].isCompleted && <CheckIcon />}
              </div>
            ))}
          </div>
        </ScrollArea>
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const UserComponent = () => {
  const { user } = UserAuth();
  const userSkillsRef = collection(database, "user_skills");
  const [selectedSkill, setSelectedSkill] = useState({ name: "", level: "" });
  const [skillPlans, setSkillPlans] = useState([]);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [lurnPages, setLurnPages] = useState([]);
  const [count, setCount] = useState({ total: 0, done: 0 });
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [generatingLurn, setGeneratingLurn] = useState(false);
  const [googleApi, setGoogleApi] = useState("");

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
    const skills = getSkills();
    const points = getPoints();

    Promise.all([skills, points]).then(() => {
      setIsLoading(false);
    });
  }, []);

  const getPlan = async () => {
    const key = selectedSkill.name + "_" + selectedSkill.level;
    const docRef = doc(database, "user_plan", key);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setGeneratingPlan(false);
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
            content: `I consider myself at a ${selectedSkill.level} level and I want to learn more about ${selectedSkill.name}, can you give me only a 5-step plan for learning ${selectedSkill.level} level stuff with each learning expressed in a single line and only give me the bullet points and no other text`,
          },
        ],
      });
      const content = res.data.data.choices[0].message.content;
      const data = parseToArrays(content);
      setDoc(docRef, {
        data,
      });
      setGeneratingPlan(false);
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
      return [];
    }
  };

  const handleLurn = async () => {
    setGeneratingPlan(true);
    setGeneratingLurn(true);
    const currentPlan = getPlan();

    const completedPlans = getCompletedPlans();

    Promise.all([currentPlan, completedPlans]).then(async (values) => {
      const current = values[0].slice(0, 5) as any[];
      const done = values[1] as any[];
      const googleUrl = "api/getGoogleData";
      const _count = { total: current.length, done: 0 };

      const plans = values[0].map((e: any) => {
        return { plan: e, isCompleted: done.indexOf(e) !== -1 };
      });

      setSkillPlans(plans);

      const _lurnPages = [];
      let i = 0;
      for (const plan of current) {
        const isCompletedPlan = done.indexOf(plan) !== -1;
        if (isCompletedPlan) {
          _count.done += 1;
        }
        const googleRes = await axios.get(googleUrl, {
          params: {
            q: plan + " in " + selectedSkill.name,
            api: googleApi,
          },
        });

        const curLurnPage = {
          ...googleRes.data.data,
          plan: plan,
          skill: selectedSkill,
          completedPlan: isCompletedPlan,
          points: i * 5 + 10,
        };
        i++;
        _lurnPages.push(curLurnPage);
      }

      setCount(_count);

      setLurnPages(_lurnPages);
      setGeneratingLurn(false);
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

    if (currentSkill?.level != "Advanced") setCount({ total: 0, done: 0 });
  };

  const handleDone = async (lurn: {
    title: string;
    points: number;
    plan: string;
  }) => {
    const docRef = doc(database, "user_points", user.uid);
    const docSnap = await getDoc(docRef);
    let currentId = lurnPages.findIndex((e) => {
      return e.title === lurn.title;
    });

    const newLurnPages: any[] = lurnPages.slice();
    const newLurnPage = { ...newLurnPages[currentId], completedPlan: true };
    newLurnPages.splice(currentId, 1, newLurnPage);
    setLurnPages(newLurnPages);

    let currentPlanId = skillPlans.findIndex((e) => {
      return e.plan === lurn.plan;
    });
    const newSkillPlans: any[] = skillPlans.slice();
    const newSkillPlan = { ...newSkillPlans[currentPlanId], isCompleted: true };
    newSkillPlans.splice(currentPlanId, 1, newSkillPlan);
    setSkillPlans(newSkillPlans);

    console.log(count);

    setCount((count) => ({
      ...count,
      done: count.done + 1,
    }));

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        points: docSnap.data()["points"] + lurn.points,
      });
    }

    setPoints((point) => point + lurn.points);
  };

  const handleDelete = async (skill: Skill) => {
    const q = query(userSkillsRef, where("user_id", "==", user.uid));
    const skillSnap = await getDocs(q);
    const curSkills = userSkills.slice().filter((v) => v.name != skill.name);
    setUserSkills(curSkills);

    if (!skillSnap.empty) {
      const skillRef = doc(database, "user_skills", skillSnap.docs[0].id);
      await updateDoc(skillRef, {
        skills: arrayRemove(skill),
      });
    }
  };

  const handleSubmitEditPlan = async (plans: any[]) => {
    const key = selectedSkill.name + "_" + selectedSkill.level;
    const docRef = doc(database, "user_plan", key);
    const docSnap = await getDoc(docRef);
    console.log(plans);
    setSkillPlans(plans);
    if (docSnap.exists()) {
      await updateDoc(docRef, {
        data: plans.map((e) => e.plan),
      });
    }
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
        {isLoading ? (
          <div className="text-3xl font-light flex items-center">
            🏅 <Skeleton className="h-5 w-20 bg-amber-400" />
          </div>
        ) : (
          <div className="text-3xl font-light text-amber-400">🏅 {points}</div>
        )}
        <p className="text-muted-foreground">
          How about we learn something new today or just get better at something
        </p>
      </div>
      <Separator className="my-4" />
      <div className="mr-auto mr-4">
        <AddSheet handleAdd={handleAdd} />
      </div>
      <div>
        <Input
          value={googleApi}
          className="w-1/2"
          placeholder="Google API"
          onChange={(e) => setGoogleApi(e.target.value)}
        />
        <div className="text-sm text-muted-foreground">
          Enter your Google API incase the server limit is reached
        </div>
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
        {isLoading ? (
          <div className="flex p-4">
            <div className="flex flex-col items-center space-y-4 p-5">
              <Skeleton className="h-[150px] w-[150px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 p-5">
              <Skeleton className="h-[150px] w-[150px]" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
        ) : (
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
                        ? "dark:drop-shadow-[0_5px_10px_cyan] drop-shadow-[0_1px_5px_blue] "
                        : ""
                    }`}
                    aspectRatio="square"
                    width={150}
                    height={150}
                    handleDelete={handleDelete}
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
        )}
      </div>
      <div
        onClick={() => {
          if (generatingLurn || generatingPlan) return;
          handleLurn();
        }}
      >
        <div className="mb-4">
          <button
            type="button"
            className="flex justify-center max-w-sm w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-green-400 transition-all hover:cursor-pointer focus:outline-none text-white text-2xl uppercase font-bold shadow-md rounded-full mx-auto p-5"
            style={{ opacity: selectedSkill.name == "" ? 0.5 : 1 }}
            disabled={selectedSkill.name == ""}
          >
            <div className="flex justify-center items-center">
              {generatingPlan || generatingLurn ? (
                <div className="col-span-2 pt-2">Generating</div>
              ) : (
                <div className="col-span-2 pt-2">lurn</div>
              )}
            </div>
          </button>
        </div>
      </div>
      <div className=" h-[60vh] grid gap-4 md:grid-cols-3 lg:grid-cols-7">
        {generatingPlan && (
          <div className="flex p-4 col-span-2">
            <div className="flex flex-col items-center space-y-4 p-5">
              <Skeleton className="h-[50vh] w-[20vw]" />
            </div>
          </div>
        )}
        {!!skillPlans.length && (
          <ScrollArea className="rounded-md border md:col-span-1 lg:col-span-2">
            <div className="p-4">
              <h4 className="mb-4 text-sm font-medium leading-none">Plan</h4>
              <EditPlans plans={skillPlans} handleEdit={handleSubmitEditPlan} />
              {skillPlans.map((plan, i) => (
                <>
                  <div
                    key={plan.plan}
                    className={`text-xs rounded-lg p-2 relative ${
                      plan.isCompleted
                        ? "bg-green-500 text-white shadow-md shadow-green-500"
                        : ""
                    }`}
                  >
                    {i + 1}. {plan.plan}
                  </div>

                  <Separator className="my-2" />
                </>
              ))}
            </div>
          </ScrollArea>
        )}
        {generatingLurn && (
          <div className="flex p-4 col-span-5">
            <div className="flex flex-col items-center space-y-4 p-5">
              <Skeleton className="h-[50vh] w-[60vw]" />
            </div>
          </div>
        )}
        {!!lurnPages.length && (
          <ScrollArea className="grid rounded-md border p-5 md:col-span-2 lg:col-span-5">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 gap-y-10">
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
                      className={`col-span-1 bg-background rounded-lg `}
                      aspectRatio="landscape"
                    />
                  </div>
                ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  );
};
