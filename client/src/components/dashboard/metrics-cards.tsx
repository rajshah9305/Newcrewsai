import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckSquare, TrendingUp, Clock } from "lucide-react";

interface MetricsCardsProps {
  analytics?: {
    activeCrews: number;
    totalTasks: number;
    successRate: number;
    avgDuration: number;
    totalAgents: number;
  };
}

export default function MetricsCards({ analytics }: MetricsCardsProps) {
  const metrics = [
    {
      title: "Active Crews",
      value: analytics?.activeCrews?.toString() || "0",
      change: "+2 from yesterday",
      changeType: "positive" as const,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Total Tasks", 
      value: analytics?.totalTasks?.toString() || "0",
      change: "+18% this week",
      changeType: "positive" as const,
      icon: CheckSquare,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Success Rate",
      value: analytics?.successRate ? `${analytics.successRate}%` : "0%",
      change: "+2.1% improvement",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "Avg Duration",
      value: analytics?.avgDuration ? `${Math.floor(analytics.avgDuration / 60)}m ${analytics.avgDuration % 60}s` : "0s",
      change: "+12s slower",
      changeType: "negative" as const,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title} className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{metric.title}</p>
                  <p className="text-3xl font-bold text-slate-800 dark:text-slate-200 mt-1">{metric.value}</p>
                  <p className={`text-sm mt-2 ${
                    metric.changeType === "positive" ? "text-success" : "text-destructive"
                  }`}>
                    {metric.change}
                  </p>
                </div>
                <div className={`w-12 h-12 ${metric.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
