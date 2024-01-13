import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const RecentTasks = ({ tasks }: { tasks: any[] }) => {
  return (
    <div className="space-y-8">
      {tasks.map((task) => {
        return (
          <div key={task.title} className="flex items-center">
            <Avatar className="h-9 w-9">
              <AvatarImage src={task.img} alt="Avatar" />
              <AvatarFallback>{task.skill[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1 pr-4">
              <p className="text-sm font-medium leading-none"> {task.title}</p>
              <p className="text-sm font-light leading-none">
                {" "}
                {new Date(task.date).toDateString()}
              </p>
              <p className="text-sm text-muted-foreground">{task.snippet}</p>
            </div>
            <div className="ml-auto font-medium">{task.skill}</div>
          </div>
        );
      })}
    </div>
  );
};
