import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Cpu, DollarSign, Zap } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";

interface ExecutionMetrics {
  duration: number;
  tokensUsed: number;
  apiCalls: number;
  estimatedCost: number;
}

interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: "success" | "info" | "warning";
}

export default function ExecutionMetrics() {
  const [metrics, setMetrics] = useState<ExecutionMetrics>({
    duration: 0,
    tokensUsed: 0,
    apiCalls: 0,
    estimatedCost: 0,
  });
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  const { onMessage } = useWebSocket("/ws");

  useEffect(() => {
    onMessage("execution_update", (data: any) => {
      if (data.metrics) {
        setMetrics(data.metrics);
      }
      
      if (data.step && data.timestamp) {
        const newActivity: ActivityItem = {
          id: Date.now().toString(),
          message: data.step,
          timestamp: data.timestamp,
          type: data.step.includes("completed") || data.step.includes("finished") ? "success" :
                data.step.includes("Warning") || data.step.includes("delay") ? "warning" : "info"
        };
        
        setActivities(prev => [newActivity, ...prev.slice(0, 9)]); // Keep only last 10 items
      }
    });

    onMessage("execution_completed", () => {
      const completedActivity: ActivityItem = {
        id: Date.now().toString(),
        message: "Execution completed successfully",
        timestamp: new Date().toLocaleTimeString(),
        type: "success"
      };
      setActivities(prev => [completedActivity, ...prev.slice(0, 9)]);
    });
  }, [onMessage]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  const getActivityIndicator = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "info":
        return "bg-primary";
      default:
        return "bg-slate-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Live Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Live Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Duration</span>
            </div>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {formatDuration(metrics.duration)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Tokens Used</span>
            </div>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(metrics.tokensUsed)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">API Calls</span>
            </div>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {formatNumber(metrics.apiCalls)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <span className="text-slate-600 dark:text-slate-400">Estimated Cost</span>
            </div>
            <span className="font-mono text-slate-800 dark:text-slate-200">
              {formatCost(metrics.estimatedCost)}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
            {activities.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  Activity will appear here during execution
                </p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${getActivityIndicator(activity.type)} rounded-full mt-2 flex-shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 dark:text-slate-200 text-sm">
                      {activity.message}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Connection</span>
            <Badge variant="secondary" className="bg-success/10 text-success">
              <div className="w-2 h-2 bg-success rounded-full mr-2 pulse-dot" />
              Online
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Queue Status</span>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              Ready
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600 dark:text-slate-400">Memory Usage</span>
            <span className="text-sm text-slate-800 dark:text-slate-200">
              Normal
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
