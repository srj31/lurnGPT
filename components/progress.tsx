import { guitar_history, skills } from "@/data/lurn";
import { ScrollArea, ScrollBar } from "../components/ui/scroll-area";
import { SkillArtwork } from "./artwork";
import { useState } from "react";
import { SkillPageCard } from "./lurn_page";

export const Progress = () => {
  const [selectedSkill, setSelectedSkill] = useState({ name: "", level: "" });
  return (
    <div className="flex flex-col  space-y-2">
      <div className="flex justify-center">
        <div className="">
          <ScrollArea>
            <div className="flex space-x-4 pb-4">
              {skills.map((skill) => (
                <SkillArtwork
                  key={skill.skill_name}
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
      <div className="flex justify-center">
        <ScrollArea className="h-[50vh] w-[80vw] rounded-md border">
          <div className="grid grid-cols-4 gap-4 pb-4">
            {guitar_history.map((page) => (
              <SkillPageCard
                key={page.title}
                page={page}
                className={`col-span-1`}
                aspectRatio="landscape"
              />
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
