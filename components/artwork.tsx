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
}

export function SkillArtwork({
  skill,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}: SkillArtworkProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="overflow-hidden dark:bg-white bg-gray-100 rounded-md">
            <Image
              src={skill.image}
              alt={skill.name}
              width={width}
              height={height}
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
        <p className="text-xs text-muted-foreground">
          {skill.description}
        </p>
      </div>
    </div>
  );
}
