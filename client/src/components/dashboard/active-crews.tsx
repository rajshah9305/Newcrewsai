import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import type { Crew } from "@shared/schema";

interface ActiveCrewsProps {
  crews: Crew[];
}

export default function ActiveCrews({ crews }: ActiveCrewsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-success/10 text-success";
      case "pending":
        return "bg-warning/10 text-warning";
      case "completed":
        return "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  const getProgressColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-success";
      case "pending":
        return "bg-warning";
      case "completed":
        return "bg-slate-400";
      default:
        return "bg-slate-300";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Crews</CardTitle>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Crew
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {crews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 dark:text-slate-400 mb-4">No crews created yet</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Crew
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {crews.map((crew) => (
              <div key={crew.id} className="border border-slate-200 dark:border-slate-700 rounded-lg p-4 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{crew.name}</h4>
                  <Badge className={`text-xs ${getStatusColor(crew.status)}`}>
                    {crew.status}
                  </Badge>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Agents</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {Array.isArray(crew.agentIds) ? crew.agentIds.length : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">Tasks</span>
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {Array.isArray(crew.taskIds) ? crew.taskIds.length : 0}
                    </span>
                  </div>
                  <Progress value={crew.progress} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {crew.startedAt ? `Started ${new Date(crew.startedAt).toLocaleTimeString()}` : "Not started"}
                  </span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-blue-700">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
