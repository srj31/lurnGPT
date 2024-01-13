import Link from "next/link";

import { cn } from "@/lib/utils";
import { ModeToggle } from "./toggle_theme";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <div>LurnGPT</div>
      <ModeToggle />
    </nav>
  );
}
