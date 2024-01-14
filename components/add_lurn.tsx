import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { useState } from "react";
import { Skill } from "@/data/lurn";
import { toast } from "sonner";

export function AddSheet({ handleAdd }: { handleAdd: (skill: Skill) => void }) {
  const [selectedLevel, setSelectedLevel] = useState("Beginner");
  const [skillName, setName] = useState("");
  const [skillDescription, setDescription] = useState("");
  const [skillImage, setImage] = useState("");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Add
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Add Skill</SheetTitle>
          <SheetDescription>
            What other skill do you want to lurn?
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-8 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Skill
            </Label>
            <Input
              id="skill_name"
              className="col-span-3"
              value={skillName}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Describe
            </Label>
            <Input
              id="skill_description"
              className="col-span-3"
              value={skillDescription}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Image Link
            </Label>
            <Input
              id="skill_image"
              className="col-span-3"
              value={skillImage}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-5 items-center gap-4">
            <RadioGroup
              value={selectedLevel}
              onValueChange={(e) => setSelectedLevel(e)}
              defaultValue="Beginner"
              className="col-start-2 col-span-3 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Beginner" id="r1" />
                <Label htmlFor="r1">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Intermediate" id="r2" />
                <Label htmlFor="r2">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Advanced" id="r3" />
                <Label htmlFor="r3">Advanced</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button
              type="submit"
              onClick={() => {
                handleAdd({
                  description: skillDescription,
                  image: skillImage,
                  name: skillName,
                  level: selectedLevel,
                });
                toast.success("Skill has been added");
              }}
            >
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
