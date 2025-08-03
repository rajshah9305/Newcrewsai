import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import MetricsCards from "@/components/dashboard/metrics-cards";
import QuickActions from "@/components/dashboard/quick-actions";
import RecentActivity from "@/components/dashboard/recent-activity";
import ActiveCrews from "@/components/dashboard/active-crews";
import AgentForm from "@/components/agents/agent-form";
import AgentCard from "@/components/agents/agent-card";
import TaskForm from "@/components/tasks/task-form";
import TaskCard from "@/components/tasks/task-card";
import TemplateCard from "@/components/templates/template-card";
import ExecutionOutput from "@/components/execution/execution-output";
import ExecutionMetrics from "@/components/execution/execution-metrics";
import FileCard from "@/components/files/file-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Search, Filter, Download, Upload, BarChart3, PieChart, Star, Eye, Users, CheckSquare, Clock, DollarSign, PlayCircle, CheckCircle, TrendingUp, AlertCircle } from "lucide-react";
import type { Agent, Task, Crew, Template, File } from "@shared/schema";

type TabType = "dashboard" | "agents" | "tasks" | "templates" | "execution" | "analytics" | "files";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);

  const { data: agents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: crews = [] } = useQuery<Crew[]>({
    queryKey: ["/api/crews"],
  });

  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  const { data: files = [] } = useQuery<File[]>({
    queryKey: ["/api/files"],
  });

  const { data: analytics } = useQuery({
    queryKey: ["/api/analytics/overview"],
  });

  const tabConfig = {
    dashboard: { title: "Dashboard", subtitle: "Welcome back! Here's what's happening with your crews." },
    agents: { title: "Agents", subtitle: "Create and manage your AI agents" },
    tasks: { title: "Tasks", subtitle: "Manage tasks and assignments for your agents" },
    templates: { title: "Templates", subtitle: "Browse and use pre-built crew templates" },
    execution: { title: "Execution", subtitle: "Configure and monitor crew execution in real-time" },
    analytics: { title: "Analytics", subtitle: "Performance metrics and insights for your crews" },
    files: { title: "Files", subtitle: "Manage generated files and outputs" }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="flex-1 flex flex-col lg:ml-0">
        <Header 
          title={tabConfig[activeTab].title}
          subtitle={tabConfig[activeTab].subtitle}
        />

        <main className="flex-1 overflow-y-auto">
          {activeTab === "dashboard" && (
            <div className="p-6 space-y-8">
              {/* Header Actions */}
              <div className="flex items-center justify-end space-x-2">
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Crew
                </Button>
                <Button variant="outline" size="sm">
                  Templates
                </Button>
                <Button variant="outline" size="sm">
                  Analytics
                </Button>
                <Button variant="outline" size="sm">
                  Settings
                </Button>
              </div>

              <MetricsCards analytics={analytics} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Crews Section */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Active Crews</CardTitle>
                      <Button variant="outline" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        New Crew
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Running Crew */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full" />
                            <span className="text-sm font-medium text-green-600">Running</span>
                          </div>
                          <span className="text-xs text-slate-500">-</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Research Crew</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">3 agents • 2 tasks</p>
                        <div className="text-xs text-slate-500 mb-2">Cerebras Llama3.1-70B</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Button size="sm" variant="outline">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Pending Crew */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full" />
                            <span className="text-sm font-medium text-orange-600">Pending</span>
                          </div>
                          <span className="text-xs text-slate-500">-</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Content Pipeline</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">2 agents • 1 tasks</p>
                        <div className="text-xs text-slate-500 mb-2">Cerebras Llama3.1-8B</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Button size="sm" variant="outline">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>

                      {/* Completed Crew */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-slate-500 rounded-full" />
                            <span className="text-sm font-medium text-slate-600">Completed</span>
                          </div>
                          <span className="text-xs text-slate-500">-</span>
                        </div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Data Analysis</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">1 agents • 1 tasks</p>
                        <div className="text-xs text-slate-500 mb-2">Cerebras Llama3.1-70B</div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                          <div className="bg-slate-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Button size="sm" variant="outline">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Feed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            Crew Completed
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Research Crew finished market analysis task
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            5 minutes ago • Research Crew
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            New Task Started
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Content Pipeline began blog post generation
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            15 minutes ago • Content Pipeline
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            Rate Limit Warning
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            API usage approaching daily limit
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            30 minutes ago
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            Template Created
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            New workflow template "Data Analysis" created
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            about 1 hour ago
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Agents</h2>
                  <p className="text-slate-600 dark:text-slate-400">Create and manage your AI agents</p>
                </div>
                <Button onClick={() => setShowAgentForm(!showAgentForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Agent
                </Button>
              </div>

              {showAgentForm && (
                <AgentForm onClose={() => setShowAgentForm(false)} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No agents yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first agent to get started</p>
                    <Button onClick={() => setShowAgentForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Agent
                    </Button>
                  </div>
                ) : (
                  agents.map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Tasks</h2>
                  <p className="text-slate-600 dark:text-slate-400">Manage tasks and assignments for your agents</p>
                </div>
                <Button onClick={() => setShowTaskForm(!showTaskForm)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Task
                </Button>
              </div>

              {showTaskForm && (
                <TaskForm agents={agents} onClose={() => setShowTaskForm(false)} />
              )}

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by:</span>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Priorities</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No tasks yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Create your first task to get started</p>
                    <Button onClick={() => setShowTaskForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Task
                    </Button>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task.id} task={task} agents={agents} />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "templates" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Templates</h2>
                  <p className="text-slate-600 dark:text-slate-400">Browse and use pre-built crew templates</p>
                </div>
                <Button variant="secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Save Current Config
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search templates..." className="pl-10" />
                    </div>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="data-science">Data Science</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="popularity">Popularity</SelectItem>
                        <SelectItem value="rating">Rating</SelectItem>
                        <SelectItem value="recent">Recent</SelectItem>
                        <SelectItem value="downloads">Downloads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <TemplateCard key={template.id} template={template} />
                ))}
              </div>
            </div>
          )}

          {activeTab === "execution" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Execution</h2>
                  <p className="text-slate-600 dark:text-slate-400">Configure and monitor crew execution in real-time</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <ExecutionOutput />
                </div>
                <div>
                  <ExecutionMetrics />
                </div>
              </div>
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Analytics</h2>
                  <p className="text-slate-600 dark:text-slate-400">Performance metrics and insights for your crews</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Time Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7d">Last 7 Days</SelectItem>
                      <SelectItem value="30d">Last 30 Days</SelectItem>
                      <SelectItem value="90d">Last 90 Days</SelectItem>
                      <SelectItem value="all">All Time</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Executions</h3>
                      <PlayCircle className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">247</p>
                    <p className="text-success text-sm mt-1">+12.4% from last week</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium">Success Rate</h3>
                      <CheckCircle className="w-5 h-5 text-success" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">94.2%</p>
                    <p className="text-success text-sm mt-1">+2.1% improvement</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium">Avg Duration</h3>
                      <Clock className="w-5 h-5 text-warning" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">2m 34s</p>
                    <p className="text-destructive text-sm mt-1">+8s slower</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total Cost</h3>
                      <DollarSign className="w-5 h-5 text-secondary" />
                    </div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">$24.73</p>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">This month</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Execution Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">Monthly execution trends chart</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm">Interactive chart would display here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cost Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                      <div className="text-center">
                        <PieChart className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                        <p className="text-slate-500 dark:text-slate-400">Cost distribution pie chart</p>
                        <p className="text-slate-400 dark:text-slate-500 text-sm">Interactive chart would display here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "files" && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Files</h2>
                  <p className="text-slate-600 dark:text-slate-400">Manage generated files and outputs</p>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Total: <span className="font-medium">{files.length} files</span>
                  </div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by:</span>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="report">Reports</SelectItem>
                        <SelectItem value="strategy">Strategies</SelectItem>
                        <SelectItem value="data">Data</SelectItem>
                        <SelectItem value="code">Code</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Date" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Dates</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                        <SelectItem value="month">This Month</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input placeholder="Search files..." className="pl-10" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {files.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No files yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-4">Files generated by your crews will appear here</p>
                  </div>
                ) : (
                  files.map((file) => (
                    <FileCard key={file.id} file={file} />
                  ))
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}