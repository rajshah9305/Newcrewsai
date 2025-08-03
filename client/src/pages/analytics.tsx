import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Clock, 
  Zap,
  Download,
  Activity,
  DollarSign,
  Filter,
  Calendar
} from "lucide-react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics/overview"],
  });

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Success Rate',
        data: [85, 92, 88, 94, 91, 96, 89],
        borderColor: 'rgb(37, 99, 235)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Execution Time',
        data: [2.3, 2.1, 2.5, 1.9, 2.2, 1.8, 2.4],
        borderColor: 'rgb(124, 58, 237)',
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        tension: 0.4,
      }
    ],
  };

  const usageData = {
    labels: ['Research', 'Content', 'Analysis', 'Support', 'Development'],
    datasets: [
      {
        data: [30, 25, 20, 15, 10],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(124, 58, 237, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const metrics = [
    {
      title: "Total Executions",
      value: "1,247",
      change: "+12%",
      trend: "up",
      icon: BarChart3,
      color: "text-blue-600"
    },
    {
      title: "Active Agents",
      value: "18",
      change: "+3",
      trend: "up", 
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Success Rate",
      value: "94.2%",
      change: "+2.1%",
      trend: "up",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Avg Duration",
      value: "2.3s",
      change: "-0.2s",
      trend: "down",
      icon: Clock,
      color: "text-yellow-600"
    }
  ];

  const topPerformers = [
    { name: "Research Agent", executions: 342, successRate: 98.5, avgDuration: 1.8 },
    { name: "Content Creator", executions: 289, successRate: 96.2, avgDuration: 2.1 },
    { name: "Data Analyst", executions: 234, successRate: 95.8, avgDuration: 2.4 },
    { name: "Support Agent", executions: 198, successRate: 94.1, avgDuration: 1.9 },
    { name: "Code Reviewer", executions: 156, successRate: 92.7, avgDuration: 3.2 }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
                <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Analytics</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Monitor performance metrics and crew insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{metric.title}</p>
                  <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">{metric.value}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3 text-green-500" />
                    ) : (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    )}
                    <span className={`text-xs ${metric.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {metric.change}
                    </span>
                  </div>
                </div>
                <metric.icon className={`w-5 h-5 ${metric.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="agents">Agents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <Line data={performanceData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <Pie data={usageData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topPerformers.map((agent, index) => (
                  <div key={agent.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200">{agent.name}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {agent.executions} executions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="text-center">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {agent.successRate}%
                        </p>
                        <p className="text-slate-500">Success</p>
                      </div>
                      <div className="text-center">
                        <p className="font-medium text-slate-800 dark:text-slate-200">
                          {agent.avgDuration}s
                        </p>
                        <p className="text-slate-500">Avg Duration</p>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <Zap className="w-3 h-3 mr-1" />
                        High Performance
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>API Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Total Calls</span>
                    <span className="font-medium">24,567</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Success Rate</span>
                    <span className="font-medium">99.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Avg Response</span>
                    <span className="font-medium">127ms</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">CPU Usage</span>
                    <span className="font-medium">68%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Memory</span>
                    <span className="font-medium">4.2GB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Storage</span>
                    <span className="font-medium">1.8TB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">This Month</span>
                    <span className="font-medium">$247.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Last Month</span>
                    <span className="font-medium">$219.40</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600 dark:text-slate-400">Projected</span>
                    <span className="font-medium">$265.20</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent Performance Matrix</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-4 text-sm font-medium text-slate-600 dark:text-slate-400 border-b pb-2">
                  <div>Agent</div>
                  <div>Status</div>
                  <div>Executions</div>
                  <div>Success Rate</div>
                  <div>Avg Duration</div>
                </div>
                {topPerformers.map((agent) => (
                  <div key={agent.name} className="grid grid-cols-5 gap-4 items-center py-2">
                    <div className="font-medium text-slate-800 dark:text-slate-200">{agent.name}</div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 w-fit">
                      Active
                    </Badge>
                    <div className="text-slate-600 dark:text-slate-400">{agent.executions}</div>
                    <div className="text-slate-600 dark:text-slate-400">{agent.successRate}%</div>
                    <div className="text-slate-600 dark:text-slate-400">{agent.avgDuration}s</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}