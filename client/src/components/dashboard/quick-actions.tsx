import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, PlusSquare, Play, ArrowRight } from "lucide-react";

interface QuickActionsProps {
  onTabChange: (tab: string) => void;
}

export default function QuickActions({ onTabChange }: QuickActionsProps) {
  const actions = [
    {
      title: "Create New Agent",
      description: "Add AI agents to your crew",
      icon: UserPlus,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      onClick: () => onTabChange("agents"),
    },
    {
      title: "Add Task",
      description: "Define new tasks and workflows",
      icon: PlusSquare,
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      onClick: () => onTabChange("tasks"),
    },
    {
      title: "Start Execution",
      description: "Run your crew workflows",
      icon: Play,
      gradient: "from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100",
      onClick: () => onTabChange("execution"),
    },
  ];

  return (
    <Card className="card-modern">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-between p-4 h-auto group hover:bg-gradient-to-r hover:from-accent/50 hover:to-transparent transition-all duration-300 rounded-xl border border-border/50 hover:border-border hover:shadow-md"
              onClick={action.onClick}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
