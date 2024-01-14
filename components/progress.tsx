import { Skill, guitar_history, skills } from "@/data/lurn";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { SkillArtwork } from "./artwork";
import { useEffect, useState } from "react";
import { SkillPageCard } from "./lurn_page";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "@/app/config";
import { UserAuth } from "@/app/context/AuthContext";
import { Play } from "next/font/google";
import { Skeleton } from "./ui/skeleton";

export const Progress = () => {
  const { user } = UserAuth();
  const [selectedSkill, setSelectedSkill] = useState({ name: "", level: "" });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  const [selectedSkillHistory, setSelectedSkillHistory] = useState([]);
  const userSkillsRef = collection(database, "user_skills");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSkills = async () => {
      const q = query(userSkillsRef, where("user_id", "==", user.uid));
      const skillSnap = await getDocs(q);
      if (!skillSnap.empty) {
        setUserSkills(skillSnap.docs[0].data().skills);
      }

      setIsLoading(false);
    };
    getSkills();
  }, []);

  useEffect(() => {
    const getHistory = async () => {
      const taskDoneRef = doc(database, "user_tasks_done", user.uid);
      const docSnap = await getDoc(taskDoneRef);

      if (docSnap.exists()) {
        const filteredData = docSnap
          .data()
          ["done"].filter((task: any) => task.skill == selectedSkill.name);
        setSelectedSkillHistory(filteredData);
      } else {
        setSelectedSkillHistory([]);
      }
    };

    getHistory();
  }, [selectedSkill]);
  return (
    <div className="flex flex-col  space-y-2">
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
                    key={skill.name}
                    skill={skill}
                    className={`w-[150px] ${
                      selectedSkill.name == skill.name
                        ? "dark:drop-shadow-[0_1px_5px_cyan] drop-shadow-[0_1px_5px_blue] "
                        : ""
                    }`}
                    aspectRatio="square"
                    width={150}
                    height={150}
                    readonly={true}
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
      <div className="flex justify-center">
        <ScrollArea className="grid space-y-2 h-[50vh] w-[90vw] rounded-md border p-4">
          <div className="grid grid-cols-3 gap-y-10 gap-x-10 pb-4">
            {selectedSkillHistory &&
              selectedSkillHistory.map((page) => (
                <div
                  key={page.title + page.skill}
                  className="bg-gradient-to-r from-green-800 to-green-500 p-[0.25rem] rounded-lg shadow-lg shadow-green-500"
                >
                  <SkillPageCard
                    key={page.title + page.skill}
                    page={page}
                    className={`rounded-md col-span-1 bg-background`}
                    aspectRatio="landscape"
                    readonly={true}
                  />
                </div>
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
