import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckSquare, TrendingUp, Clock, ArrowUp, ArrowDown } from "lucide-react";

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
      value: analytics?.activeCrews?.toString() || "2",
      change: "+2 from yesterday",
      changeType: "positive" as const,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
    },
    {
      title: "Total Tasks", 
      value: analytics?.totalTasks?.toString() || "0",
      change: "+18% this week",
      changeType: "positive" as const,
      icon: CheckSquare,
      color: "text-purple-600",
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      iconBg: "bg-gradient-to-br from-purple-500 to-purple-600",
    },
    {
      title: "Success Rate",
      value: analytics?.successRate ? `${analytics.successRate}%` : "0%",
      change: "+2.1% improvement",
      changeType: "positive" as const,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      iconBg: "bg-gradient-to-br from-green-500 to-green-600",
    },
    {
      title: "Avg Duration",
      value: analytics?.avgDuration ? `${Math.floor(analytics.avgDuration / 60)}m ${analytics.avgDuration % 60}s` : "0s",
      change: "+12s slower",
      changeType: "negative" as const,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      iconBg: "bg-gradient-to-br from-orange-500 to-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const ChangeIcon = metric.changeType === "positive" ? ArrowUp : ArrowDown;
        
        return (
          <Card 
            key={metric.title} 
            className="card-modern card-hover group cursor-pointer overflow-hidden relative"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <CardContent className="p-6 relative">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-muted-foreground text-sm font-medium mb-2">{metric.title}</p>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-3xl font-bold text-foreground tracking-tight">{metric.value}</p>
                  </div>
                </div>
                
                <div className={`w-12 h-12 ${metric.iconBg} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  metric.changeType === "positive" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  <ChangeIcon className="w-3 h-3" />
                  <span>{metric.change}</span>
                </div>
              </div>
              
              {/* Progress bar animation */}
              <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full ${metric.iconBg} rounded-full progress-animation`}
                  style={{ 
                    width: metric.changeType === "positive" ? "75%" : "45%",
                    animationDelay: `${index * 200 + 500}ms`
                  }}
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
