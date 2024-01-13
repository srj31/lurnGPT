import { cn } from "@/lib/utils";
import Image from "next/image";

interface SkillArtworkProps extends React.HTMLAttributes<HTMLDivElement> {
  page: any;
  aspectRatio?: "portrait" | "square" | "landscape";
  width?: number;
  height?: number;
}
export const SkillPageCard = ({
  page,
  aspectRatio,
  width,
  height,
  className,
  ...props
}: SkillArtworkProps) => {
  const cardClick = () => {
    window.open(page.link, "_blank");
  };
  return (
    <div
      className={cn("space-y-3", className)}
      onClick={() => cardClick()}
      {...props}
    >
      <div className="overflow-hidden dark:bg-white bg-gray-100 rounded-md flex flex-col items-center">
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
        <h3 className="font-medium leading-none">{page.title}</h3>
        <p className="text-xs text-muted-foreground">{page.snippet}</p>
      </div>
    </div>
  );
};
