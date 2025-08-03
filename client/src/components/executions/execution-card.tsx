import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Play, CheckCircle, XCircle, Pause } from "lucide-react";
import type { Execution } from "@shared/schema";

interface ExecutionCardProps {
  execution: Execution;
}

export default function ExecutionCard({ execution }: ExecutionCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running": return Play;
      case "completed": return CheckCircle;
      case "failed": return XCircle;
      case "paused": return Pause;
      default: return Clock;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running": return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "completed": return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "failed": return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      case "paused": return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300";
    }
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };

  const StatusIcon = getStatusIcon(execution.status);

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getStatusColor(execution.status).replace('text-', 'bg-').replace('-700', '-500/10').replace('-300', '-500/10')}`}>
              <StatusIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                Execution #{execution.id.slice(-8)}
              </h3>
              <Badge className={`text-xs ${getStatusColor(execution.status)} mt-1`}>
                {execution.status}
              </Badge>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Duration</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {formatDuration(execution.duration)}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">API Calls</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {execution.apiCalls}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Tokens Used</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              {execution.tokensUsed?.toLocaleString() || 'N/A'}
            </span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-slate-600 dark:text-slate-400">Cost</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">
              ${execution.estimatedCost?.toFixed(3) || '0.000'}
            </span>
          </div>
        </div>

        {execution.status === "running" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 dark:text-slate-400">Progress</span>
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                75%
              </span>
            </div>
            <Progress value={75} className="h-2" />
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Started {execution.startedAt ? new Date(execution.startedAt).toLocaleString() : 'Unknown'}
          </span>
          <div className="w-2 h-2 bg-success rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}