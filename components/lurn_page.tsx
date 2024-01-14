import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { UserAuth } from "@/app/context/AuthContext";
import { database } from "@/app/config";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";

interface SkillArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  page: any;
  aspectRatio?: "portrait" | "square" | "landscape";
  width?: number;
  height?: number;
  completed?: boolean;
  handleDone?: (v: any) => void;
  readonly?: boolean;
}
export const SkillPageCard = ({
  page,
  aspectRatio,
  width,
  height,
  className,
  completed,
  handleDone,
  readonly,
  ...props
}: SkillArtworkProps) => {
  const cardClick = () => {
    window.open(page.link, "_blank");
  };
  const { user } = UserAuth();

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleDoneTask = async () => {
    const taskDoneRef = doc(database, "user_tasks_done", user.uid);
    const docSnap = await getDoc(taskDoneRef);

    const taskDone = {
      skill: page.skill.name,
      title: page.title,
      snippet: page.snippet,
      img: page.pagemap.cse_image[0].src,
      date: Date.now(),
    };

    if (docSnap.exists()) {
      await updateDoc(taskDoneRef, {
        done: arrayUnion(taskDone),
      });
    } else {
      await setDoc(taskDoneRef, {
        done: [taskDone],
      });
    }
  };

  const handleDonePlan = async () => {
    const planDoneRef = doc(database, "user_plans_done", user.uid);
    const docSnap = await getDoc(planDoneRef);

    if (docSnap.exists()) {
      await updateDoc(planDoneRef, {
        [page.skill.name]: arrayUnion(page.plan),
      });
    } else {
      await setDoc(planDoneRef, {
        [page.skill.name]: [page.plan],
      });
    }
    setIsCompleted(true);
    await handleDone(page);
    await handleDoneTask();
  };

  return (
    <div className={cn("relative", className)} {...props}>
      <div
        className="overflow-hidden h-full  flex flex-col justify-center dark:bg-white bg-gray-100 rounded-md flex flex-col items-center"
        onClick={() => cardClick()}
      >
        <img
          src={
            page?.pagemap?.cse_image?.length > 0
              ? page.pagemap.cse_image[0].src
              : page.img
                ? page.img
                : ""
          }
          alt={"page"}
          className={cn(
            "h-auto w-auto object-fit transition-all hover:scale-105",
            aspectRatio === "portrait"
              ? "aspect-[3/4]"
              : aspectRatio === "landscape"
                ? "aspect-[16/9]"
                : "aspect-square",
          )}
        />
      </div>
      <div className="space-y-1 text-sm p-[0.5rem]">
        <h2 className="font-medium leading-none">{page.plan}</h2>
        <h3 className="font-medium leading-none">{page.title}</h3>
        <p className="text-xs text-muted-foreground">{page.snippet}</p>
      </div>
      {!readonly && (
        <div
          className="absolute w-full grid grid-cols-5 top-[94%]"
          onClick={handleDonePlan}
        >
          <div className="col-start-2 col-span-3">
            {isCompleted == true ? (
              <button className="w-full opacity-100 bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-green-600 bg-green-500 text-white shadow-md py-2 px-6">
                <span className="mx-auto">Done</span>
              </button>
            ) : (
              <button className="w-full opacity-50 hover:opacity-100 hover:cursor-pointer bg-white tracking-wide text-gray-800 font-bold rounded border-b-2 border-green-500 hover:border-green-600 hover:bg-green-500 hover:text-white shadow-md py-2 px-6">
                <span className="mx-auto">
                  Done {page.points && `(🏅 ${page.points})`}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
