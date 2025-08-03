import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Pause, Users, CheckCircle, XCircle, Clock } from "lucide-react";
import type { Crew } from "@shared/schema";

interface CrewCardProps {
  crew: Crew;
}

export default function CrewCard({ crew }: CrewCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return Play;
      case "completed": return CheckCircle;
      case "failed": return XCircle;
      case "pending": return Clock;
      default: return Pause;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "failed": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "pending": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const StatusIcon = getStatusIcon(crew.status);

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(crew.status).replace('text-', 'bg-').replace('-700', '-500/10').replace('-300', '-500/10')}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                {crew.name}
              </h3>
              <Badge className={`text-xs ${getStatusColor(crew.status)} mt-1`}>
                {crew.status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {crew.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Agents</span>
            </div>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {crew.agentIds?.length || 0}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Tasks</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {crew.taskIds?.length || 0}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {crew.progress || 0}%
            </span>
          </div>
        </div>

        {crew.status === "running" && (
          <div className="space-y-2 mb-4">
            <Progress value={crew.progress || 0} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Created {crew.createdAt ? new Date(crew.createdAt).toLocaleDateString() : 'Unknown'}
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              {crew.status === "running" ? "Pause" : "Start"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}