import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { UserAuth } from "@/app/context/AuthContext";
import { database } from "@/app/config";
import { arrayUnion, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface SkillArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  page: any;
  aspectRatio?: "portrait" | "square" | "landscape";
  width?: number;
  height?: number;
  readonly?: boolean;
}
export const SkillPageCard = ({
  page,
  aspectRatio,
  width,
  height,
  className,
  readonly,
  ...props
}: SkillArtworkProps) => {
  const cardClick = () => {
    window.open(page.link, "_blank");
  };
  const { user } = UserAuth();

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
    await handleDoneTask();
  };

  return (
    <div className={cn("space-y-3", className)} {...props}>
      <div
        className="overflow-hidden min-h-[30vh] flex flex-col justify-center dark:bg-white bg-gray-100 rounded-md flex flex-col items-center"
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
      <div className="space-y-1 text-sm">
        <h2 className="font-medium leading-none">{page.plan}</h2>
        <h3 className="font-medium leading-none">{page.title}</h3>
        <p className="text-xs text-muted-foreground">{page.snippet}</p>
      </div>
      {!readonly && (
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleDoneTask}>
            Done Task
          </Button>
          <Button variant="outline" onClick={handleDonePlan}>
            Done Plan
          </Button>
        </div>
      )}
    </div>
  );
};
