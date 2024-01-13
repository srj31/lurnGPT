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

export const Progress = () => {
  const { user } = UserAuth();
  const [selectedSkill, setSelectedSkill] = useState({ name: "", level: "" });
  const [userSkills, setUserSkills] = useState<Skill[]>([]);

  const [selectedSkillHistory, setSelectedSkillHistory] = useState([]);
  const userSkillsRef = collection(database, "user_skills");

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
      <div className="flex justify-center">
        <ScrollArea className="h-[50vh] w-[80vw] rounded-md border">
          <div className="grid grid-cols-4 gap-4 pb-4">
            {selectedSkillHistory &&
              selectedSkillHistory.map((page) => (
                <SkillPageCard
                  key={page.title}
                  page={page}
                  className={`col-span-1`}
                  aspectRatio="landscape"
                  readonly={true}
                />
              ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
