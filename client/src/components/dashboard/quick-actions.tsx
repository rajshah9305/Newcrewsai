import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, PlusSquare, Play } from "lucide-react";

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

export default function QuickActions({ onTabChange }: QuickActionsProps) {
  const actions = [
    {
      title: "Create New Agent",
      icon: UserPlus,
      color: "text-primary",
      hoverColor: "hover:border-primary hover:bg-primary/5",
      onClick: () => onTabChange("agents"),
    },
    {
      title: "Add Task",
      icon: PlusSquare,
      color: "text-secondary",
      hoverColor: "hover:border-secondary hover:bg-secondary/5",
      onClick: () => onTabChange("tasks"),
    },
    {
      title: "Start Execution",
      icon: Play,
      color: "text-success",
      hoverColor: "hover:border-success hover:bg-success/5",
      onClick: () => onTabChange("execution"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="outline"
              className={`w-full justify-start space-x-3 h-12 ${action.hoverColor} transition-colors`}
              onClick={action.onClick}
            >
              <Icon className={`w-5 h-5 ${action.color}`} />
              <span className="text-slate-700 dark:text-slate-300">{action.title}</span>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
