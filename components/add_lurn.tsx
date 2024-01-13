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
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "@/app/config";
import { useState } from "react";
import { UserAuth } from "@/app/context/AuthContext";

export function AddSheet() {
  const userSkillsRef = collection(database, "user_skills");
  const { user } = UserAuth();

  const [selectedLevel, setSelectedLevel] = useState("beginner");
  const [skillName, setName] = useState("");

  const handleAdd = async () => {
    const q = query(userSkillsRef, where("user_id", "==", user.uid));

    const skillSnap = await getDocs(q);

    console.log(skillSnap);

    if (skillSnap.empty) {
      addDoc(userSkillsRef, {
        user_id: user.uid,
        skills: [
          {
            description: "lorem ipsum",
            image: "https://images5.alphacoders.com/359/359452.jpg",
            name: skillName,
            level: selectedLevel,
          },
        ],
      });
    } else {
      const skillRef = doc(database, "user_skills", skillSnap.docs[0].id);
      const res = await updateDoc(skillRef, {
        skills: arrayUnion({
          description: "lorem ipsum",
          image: "https://images5.alphacoders.com/359/359452.jpg",
          name: skillName,
          level: selectedLevel,
        }),
      });
      console.log(skillRef);
    }

    console.log(selectedLevel, skillName, user);
  };
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
          <div className="grid grid-cols-5 items-center gap-4">
            <RadioGroup
              value={selectedLevel}
              onValueChange={(e) => setSelectedLevel(e)}
              defaultValue="beginner"
              className="col-start-2 col-span-3 space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="r1" />
                <Label htmlFor="r1">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="r2" />
                <Label htmlFor="r2">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="r3" />
                <Label htmlFor="r3">Advanced</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={handleAdd}>
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
