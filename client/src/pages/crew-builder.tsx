import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle, Plus, X, Edit, Trash2, Lightbulb } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

const basicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  model: z.string().min(1, "AI Model is required"),
});

const agentSchema = z.object({
  name: z.string().min(1, "Agent name is required"),
  role: z.string().min(1, "Role is required"),
  goal: z.string().min(1, "Goal is required"),
  backstory: z.string().min(1, "Backstory is required"),
  tools: z.array(z.string()).default([]),
});

const taskSchema = z.object({
  name: z.string().min(1, "Task name is required"),
  description: z.string().min(1, "Description is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
  assignedAgentIndex: z.number().optional(),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;
type AgentData = z.infer<typeof agentSchema>;
type TaskData = z.infer<typeof taskSchema>;

export default function CrewBuilder() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingAgent, setEditingAgent] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const basicInfoForm = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: basicInfo || { name: "", description: "", model: "" },
  });

  const agentForm = useForm<AgentData>({
    resolver: zodResolver(agentSchema),
    defaultValues: { name: "", role: "", goal: "", backstory: "", tools: [] },
  });

  const taskForm = useForm<TaskData>({
    resolver: zodResolver(taskSchema),
    defaultValues: { name: "", description: "", expectedOutput: "" },
  });

  const createCrewMutation = useMutation({
    mutationFn: async (crewData: any) => {
      await apiRequest("POST", "/api/crews", crewData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crews"] });
      toast({
        title: "Success",
        description: "Crew created successfully!",
      });
      setLocation("/crews");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create crew. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleBasicInfoSubmit = (data: BasicInfoData) => {
    setBasicInfo(data);
    setCurrentStep(2);
  };

  const handleAddAgent = (data: AgentData) => {
    if (editingAgent !== null) {
      const updatedAgents = [...agents];
      updatedAgents[editingAgent] = data;
      setAgents(updatedAgents);
      setEditingAgent(null);
    } else {
      setAgents([...agents, data]);
    }
    agentForm.reset();
    setShowAgentForm(false);
  };

  const handleAddTask = (data: TaskData) => {
    if (editingTask !== null) {
      const updatedTasks = [...tasks];
      updatedTasks[editingTask] = data;
      setTasks(updatedTasks);
      setEditingTask(null);
    } else {
      setTasks([...tasks, data]);
    }
    taskForm.reset();
    setShowTaskForm(false);
  };

  const handleDeleteAgent = (index: number) => {
    setAgents(agents.filter((_, i) => i !== index));
  };

  const handleDeleteTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const handleEditAgent = (index: number) => {
    setEditingAgent(index);
    agentForm.reset(agents[index]);
    setShowAgentForm(true);
  };

  const handleEditTask = (index: number) => {
    setEditingTask(index);
    taskForm.reset(tasks[index]);
    setShowTaskForm(true);
  };

  const handleCreateCrew = () => {
    if (!basicInfo || agents.length === 0 || tasks.length === 0) {
      toast({
        title: "Incomplete Setup",
        description: "Please complete all steps before creating the crew.",
        variant: "destructive",
      });
      return;
    }

    const crewData = {
      ...basicInfo,
      agents,
      tasks,
      status: "draft",
      progress: 0,
    };

    createCrewMutation.mutate(crewData);
  };

  const steps = [
    { id: 1, name: "Basic Info", description: "Name, description, and model" },
    { id: 2, name: "Agents", description: "Configure AI agents" },
    { id: 3, name: "Tasks", description: "Define workflows" },
    { id: 4, name: "Preview", description: "Review and create" },
  ];

  const aiModels = [
    { id: "llama-3.1-70b", name: "Cerebras Llama 3.1 70B", speed: "Ultra Fast", capability: "High", recommended: true },
    { id: "llama-3.1-8b", name: "Cerebras Llama 3.1 8B", speed: "Lightning Fast", capability: "Medium" },
    { id: "gpt-4", name: "GPT-4", speed: "Moderate", capability: "Very High" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", speed: "Fast", capability: "Medium" },
    { id: "claude-3", name: "Claude 3", speed: "Moderate", capability: "High" },
  ];

  const availableTools = [
    "web_search", "data_analysis", "competitor_analysis", "content_planning", 
    "seo_optimization", "social_media_strategy", "keyword_research", "content_optimization"
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => setLocation("/crews")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Create New Crew</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Build your AI agent crew step by step
            </p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-8 mb-8">
        {steps.map((step) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              currentStep === step.id 
                ? "bg-primary text-white" 
                : currentStep > step.id 
                  ? "bg-green-500 text-white" 
                  : "bg-slate-200 dark:bg-slate-700 text-slate-500"
            }`}>
              {currentStep > step.id ? <CheckCircle className="w-5 h-5" /> : step.id}
            </div>
            <div className="text-sm">
              <div className={`font-medium ${currentStep >= step.id ? "text-slate-800 dark:text-slate-200" : "text-slate-500"}`}>
                {step.name}
              </div>
              <div className="text-slate-500 text-xs">{step.description}</div>
            </div>
            {step.id < steps.length && (
              <div className={`w-12 h-px ${currentStep > step.id ? "bg-green-500" : "bg-slate-200 dark:bg-slate-700"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Start by giving your crew a name, description, and selecting the AI model that will power your agents.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={basicInfoForm.handleSubmit(handleBasicInfoSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Crew Name *</Label>
                <Input
                  id="name"
                  {...basicInfoForm.register("name")}
                  placeholder="Content Marketing Research Crew"
                />
                <p className="text-xs text-slate-500">Choose a name that clearly describes your crew's purpose</p>
                {basicInfoForm.formState.errors.name && (
                  <p className="text-sm text-red-500">{basicInfoForm.formState.errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  {...basicInfoForm.register("description")}
                  placeholder="An AI crew specialized in researching market trends, analyzing competitors, and creating compelling marketing content for technology products."
                  rows={4}
                />
                <p className="text-xs text-slate-500">Provide a clear description of your crew's purpose and capabilities</p>
                {basicInfoForm.formState.errors.description && (
                  <p className="text-sm text-red-500">{basicInfoForm.formState.errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">AI Model *</Label>
                <Select onValueChange={(value) => basicInfoForm.setValue("model", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an AI model" />
                  </SelectTrigger>
                  <SelectContent>
                    {aiModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center justify-between w-full">
                          <div>
                            <div className="flex items-center space-x-2">
                              <span>{model.name}</span>
                              {model.recommended && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500">
                              Speed: {model.speed} • Capability: {model.capability}
                            </div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {basicInfoForm.formState.errors.model && (
                  <p className="text-sm text-red-500">{basicInfoForm.formState.errors.model.message}</p>
                )}
                
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200">Pro Tip</h4>
                      <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                        Cerebras models offer ultra-fast inference speeds, making them perfect for real-time applications. 
                        The 70B model provides the best balance of speed and capability for most use cases.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Next: Configure Agents
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Configure Agents */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configure Agents</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Add AI agents to your crew. Each agent has a specific role, goal, and set of tools.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <Button onClick={() => setShowAgentForm(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Agent
                </Button>
                <Button variant="outline">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Quick Add Suggestion
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-800 dark:text-slate-200">
                  Agents ({agents.length})
                </h3>
                {agents.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                      No agents yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Add your first agent to get started. Each agent will have specific roles and capabilities.
                    </p>
                    <Button onClick={() => setShowAgentForm(true)} className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Agent
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {agents.map((agent, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-primary">A{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{agent.name}</h4>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Agent #{index + 1}</p>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-slate-400">GOAL</span>
                                  <p className="text-slate-800 dark:text-slate-200">{agent.goal}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-slate-400">BACKSTORY</span>
                                  <p className="text-slate-800 dark:text-slate-200">{agent.backstory}</p>
                                </div>
                                {agent.tools.length > 0 && (
                                  <div>
                                    <span className="font-medium text-slate-600 dark:text-slate-400">TOOLS</span>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {agent.tools.map((tool, toolIndex) => (
                                        <Badge key={toolIndex} variant="secondary" className="text-xs">
                                          {tool}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditAgent(index)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteAgent(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(1)}>
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(3)} 
                  disabled={agents.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next: Define Tasks
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Agent Form Modal */}
          {showAgentForm && (
            <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingAgent !== null ? "Edit Agent" : "Add New Agent"}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setShowAgentForm(false);
                      setEditingAgent(null);
                      agentForm.reset();
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={agentForm.handleSubmit(handleAddAgent)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="agentName">Agent Name *</Label>
                        <Input
                          id="agentName"
                          {...agentForm.register("name")}
                          placeholder="Market Research Analyst"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role *</Label>
                        <Input
                          id="role"
                          {...agentForm.register("role")}
                          placeholder="Senior Market Analyst"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="goal">Goal *</Label>
                      <Textarea
                        id="goal"
                        {...agentForm.register("goal")}
                        placeholder="Research and analyze market trends, competitor strategies, and customer insights to inform content strategy"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backstory">Backstory *</Label>
                      <Textarea
                        id="backstory"
                        {...agentForm.register("backstory")}
                        placeholder="You are an experienced market research analyst with 10+ years in the tech industry. You excel at identifying market opportunities, analyzing competitor data and transforming complex research data into compelling insights."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tools</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {availableTools.map((tool) => (
                          <Label key={tool} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              value={tool}
                              {...agentForm.register("tools")}
                              className="rounded"
                            />
                            <span className="text-sm">{tool.replace('_', ' ')}</span>
                          </Label>
                        ))}
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowAgentForm(false);
                          setEditingAgent(null);
                          agentForm.reset();
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                        {editingAgent !== null ? "Update Agent" : "Add Agent"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Step 3: Task Configuration */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Task Configuration</CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Define the tasks your crew will execute. Each task should have a clear description and expected output.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4 mb-6">
                <Button onClick={() => setShowTaskForm(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Task
                </Button>
              </div>

              <div className="space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Plus className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200 mb-2">
                      No tasks defined
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                      Add tasks to define what your crew will accomplish
                    </p>
                    <Button onClick={() => setShowTaskForm(true)} className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Task
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task, index) => (
                      <Card key={index} className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <div className="w-8 h-8 bg-orange-500/10 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-semibold text-orange-600">T{index + 1}</span>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-800 dark:text-slate-200">{task.name}</h4>
                                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 text-xs">
                                    pending
                                  </Badge>
                                </div>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-slate-400">Description</span>
                                  <p className="text-slate-800 dark:text-slate-200">{task.description}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-600 dark:text-slate-400">Expected Output</span>
                                  <p className="text-slate-800 dark:text-slate-200">{task.expectedOutput}</p>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditTask(index)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDeleteTask(index)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(2)}>
                  Previous
                </Button>
                <Button 
                  onClick={() => setCurrentStep(4)} 
                  disabled={tasks.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  Next: Preview & Create
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Task Form Modal */}
          {showTaskForm && (
            <Card className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{editingTask !== null ? "Edit Task" : "Add New Task"}</CardTitle>
                    <Button variant="ghost" size="sm" onClick={() => {
                      setShowTaskForm(false);
                      setEditingTask(null);
                      taskForm.reset();
                    }}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <form onSubmit={taskForm.handleSubmit(handleAddTask)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="taskName">Task Name *</Label>
                      <Input
                        id="taskName"
                        {...taskForm.register("name")}
                        placeholder="Task 1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taskDescription">Description *</Label>
                      <Textarea
                        id="taskDescription"
                        {...taskForm.register("description")}
                        placeholder="Conduct comprehensive market research on the target industry, including competitor analysis, market size assessment, and identification of key trends and opportunities."
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expectedOutput">Expected Output *</Label>
                      <Textarea
                        id="expectedOutput"
                        {...taskForm.register("expectedOutput")}
                        placeholder="A detailed market research report (2-3 pages) including competitor landscape, market trends, target audience insights, and strategic recommendations."
                        rows={4}
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setShowTaskForm(false);
                          setEditingTask(null);
                          taskForm.reset();
                        }}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                        {editingTask !== null ? "Update Task" : "Add Task"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Step 4: Preview & Create */}
      {currentStep === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview & Create</CardTitle>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Review your crew configuration and create your AI agent crew.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Basic Info Summary */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Basic Information</h3>
                <Card className="bg-slate-50 dark:bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Name:</span>
                        <span className="ml-2 text-slate-800 dark:text-slate-200">{basicInfo?.name}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Description:</span>
                        <span className="ml-2 text-slate-800 dark:text-slate-200">{basicInfo?.description}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">AI Model:</span>
                        <span className="ml-2 text-slate-800 dark:text-slate-200">{basicInfo?.model}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Agents Summary */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Agents ({agents.length})
                </h3>
                <div className="space-y-3">
                  {agents.map((agent, index) => (
                    <Card key={index} className="bg-slate-50 dark:bg-slate-800/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">{index + 1}</span>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{agent.name}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{agent.role}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Tasks Summary */}
              <div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">
                  Tasks ({tasks.length})
                </h3>
                <div className="space-y-3">
                  {tasks.map((task, index) => (
                    <Card key={index} className="bg-slate-50 dark:bg-slate-800/50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-6 h-6 bg-orange-500/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-orange-600">{index + 1}</span>
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{task.name}</span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={() => setCurrentStep(3)}>
                  Previous
                </Button>
                <Button 
                  onClick={handleCreateCrew}
                  disabled={createCrewMutation.isPending}
                  className="bg-primary hover:bg-primary/90"
                >
                  {createCrewMutation.isPending ? "Creating..." : "Create Crew"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}