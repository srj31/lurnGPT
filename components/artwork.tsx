import Image from "next/image";

import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

import { Skill } from "../data/lurn";

interface SkillArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  skill: Skill;
  aspectRatio?: "portrait" | "square";
  width?: number;
  height?: number;
  readonly: boolean;
  handleDelete?: (v: any) => void;
}

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { CrossCircledIcon } from "@radix-ui/react-icons";
import { UserAuth } from "@/app/context/AuthContext";
import { database } from "@/app/config";
import { collection } from "firebase/firestore";
import { toast } from "sonner";

const CancelButton = ({ skill, handleClick }: any) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <CrossCircledIcon
          className="hover:cursor-pointer drop-shadow-[0_0_2px_black] text-red-600"
          width={25}
          height={25}
        />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the skill
            and might lead to loss of progress
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              handleClick(skill);
              toast.error("Skill deleted");
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export function SkillArtwork({
  skill,
  aspectRatio = "portrait",
  width,
  height,
  className,
  handleDelete,
  readonly = false,
  ...props
}: SkillArtworkProps) {
  const { user } = UserAuth();
  const userSkillsRef = collection(database, "user_skills");
  return (
    <div className="relative">
      <div className={cn("space-y-3", className)} {...props}>
        <ContextMenu>
          <ContextMenuTrigger>
            <div className="overflow-hidden dark:bg-white bg-gray-100 rounded-md">
              <img
                src={skill.image}
                alt={skill.name}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
                )}
              />
            </div>
          </ContextMenuTrigger>
          <ContextMenuContent className="w-40">
            <ContextMenuItem>Add to Library</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Play Next</ContextMenuItem>
            <ContextMenuItem>Play Later</ContextMenuItem>
            <ContextMenuItem>Create Station</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Like</ContextMenuItem>
            <ContextMenuItem>Share</ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{skill.name}</h3>
          <p className="text-xs text-secondary-foreground">{skill.level}</p>
          <p className="text-xs text-muted-foreground">{skill.description}</p>
        </div>
      </div>
      {!readonly && handleDelete && (
        <div className="absolute top-0 p-1 text-red">
          <CancelButton handleClick={handleDelete} skill={skill} />
        </div>
      )}
    </div>
  );
}
