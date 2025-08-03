import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecentActivity() {
  const activities = [
    {
      message: "Research Team completed market analysis task",
      time: "2 minutes ago",
      type: "success",
    },
    {
      message: "Content Squad started blog post generation",
      time: "8 minutes ago", 
      type: "info",
    },
    {
      message: "Data Pipeline encountered processing delay",
      time: "15 minutes ago",
      type: "warning",
    },
    {
      message: "Code Review Team finished security audit",
      time: "1 hour ago",
      type: "success",
    },
  ];

  const getIndicatorColor = (type: string) => {
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
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`w-2 h-2 ${getIndicatorColor(activity.type)} rounded-full mt-2`} />
            <div className="flex-1">
              <p className="text-slate-800 dark:text-slate-200 text-sm">{activity.message}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
