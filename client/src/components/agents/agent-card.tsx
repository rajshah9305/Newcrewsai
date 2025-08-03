import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Agent } from "@shared/schema";

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteAgentMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/agents/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Success",
        description: "Agent deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete agent. Please try again.",
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success/10 text-success";
      case "busy":
        return "bg-warning/10 text-warning";
      case "idle":
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success";
      case "busy":
        return "bg-warning";
      case "idle":
        return "bg-slate-400";
      default:
        return "bg-slate-400";
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary bg-primary/10";
      case "busy":
        return "text-warning bg-warning/10";
      case "idle":
        return "text-success bg-success/10";
      default:
        return "text-primary bg-primary/10";
    }
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this agent?")) {
      deleteAgentMutation.mutate(agent.id);
    }
  };

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getIconColor(agent.status)}`}>
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">{agent.role}</h3>
              <div className="flex items-center space-x-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${getStatusIndicator(agent.status)}`} />
                <span className="text-sm text-slate-600 dark:text-slate-400 capitalize">{agent.status}</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-slate-400 hover:text-destructive"
            onClick={handleDelete}
            disabled={deleteAgentMutation.isPending}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">{agent.backstory}</p>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Performance</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{agent.performanceScore}%</span>
          </div>
          <Progress value={agent.performanceScore} className="h-2" />
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Tasks Completed</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{agent.tasksCompleted}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {Array.isArray(agent.tools) && agent.tools.map((tool) => (
            <Badge key={tool} variant="secondary" className="text-xs">
              {tool}
            </Badge>
          ))}
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          Model: {agent.model} • Temperature: {agent.temperature}
        </div>
      </CardContent>
    </Card>
  );
}
