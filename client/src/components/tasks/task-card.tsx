import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, User, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import type { Task } from "@shared/schema";

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "in_progress": return Clock;
      case "failed": return XCircle;
      default: return AlertTriangle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "in_progress": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "failed": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default: return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "high": return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const StatusIcon = getStatusIcon(task.status);

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(task.status).replace('text-', 'bg-').replace('-700', '-500/10').replace('-300', '-500/10')}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                {task.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={`text-xs ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ')}
                </Badge>
                <Badge className={`text-xs ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            View
          </Button>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2">
          {task.description}
        </p>

        <div className="space-y-3 mb-4">
          {task.assignedAgentId && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Assigned to</span>
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                Agent #{task.assignedAgentId.slice(-6)}
              </span>
            </div>
          )}
          
          {task.dueDate && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">Due Date</span>
              </div>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Progress</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {task.progress || 0}%
            </span>
          </div>
        </div>

        {task.status === "in_progress" && (
          <div className="space-y-2 mb-4">
            <Progress value={task.progress || 0} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Created {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown'}
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              Edit
            </Button>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              {task.status === "pending" ? "Start" : "Details"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}