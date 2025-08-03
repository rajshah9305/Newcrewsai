import { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Play, StopCircle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { apiRequest } from "@/lib/queryClient";

interface ExecutionMessage {
  type: string;
  executionId?: string;
  step?: string;
  timestamp?: string;
  progress?: number;
  metrics?: {
    tokensUsed: number;
    apiCalls: number;
    estimatedCost: number;
    duration: number;
  };
  message?: string;
}

export default function ExecutionOutput() {
  const { toast } = useToast();
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [output, setOutput] = useState<string[]>([]);
  const [autoScroll, setAutoScroll] = useState(true);
  const [projectDescription, setProjectDescription] = useState(
    "Develop a comprehensive market entry strategy for our new AI-powered productivity software targeting small to medium businesses in the North American market."
  );
  const [executionConfig, setExecutionConfig] = useState({
    model: "gpt-4",
    processType: "sequential",
    maxIterations: 10,
    verboseLogging: true,
    memoryEnabled: true,
    agentCollaboration: true,
  });

  const outputRef = useRef<HTMLDivElement>(null);

  const { lastMessage, sendMessage, onMessage } = useWebSocket("/ws");

  const startExecutionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/executions", {
        crewId: null, // In a real implementation, this would be selected
        status: "running",
        output: "",
        tokensUsed: 0,
        apiCalls: 0,
        estimatedCost: 0,
        duration: 0,
      });
      return response.json();
    },
    onSuccess: (execution) => {
      setCurrentExecutionId(execution.id);
      setIsExecuting(true);
      setOutput(["Initializing CrewAI execution environment..."]);
      toast({
        title: "Execution Started",
        description: "Your crew execution has been started.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start execution. Please try again.",
        variant: "destructive",
      });
    },
  });

  const stopExecutionMutation = useMutation({
    mutationFn: async (executionId: string) => {
      const response = await apiRequest("PUT", `/api/executions/${executionId}/stop`, {});
      return response.json();
    },
    onSuccess: () => {
      setIsExecuting(false);
      setCurrentExecutionId(null);
      toast({
        title: "Execution Stopped",
        description: "Execution has been stopped successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to stop execution.",
        variant: "destructive",
      });
    },
  });

  // Handle WebSocket messages
  useEffect(() => {
    onMessage("execution_update", (data: ExecutionMessage) => {
      if (data.step) {
        setOutput(prev => [...prev, `[${data.timestamp}] ${data.step}`]);
      }
    });

    onMessage("execution_completed", (data: ExecutionMessage) => {
      setIsExecuting(false);
      setCurrentExecutionId(null);
      if (data.message) {
        setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${data.message}`]);
      }
      toast({
        title: "Execution Completed",
        description: "Your crew execution has been completed successfully.",
      });
    });

    onMessage("execution_stopped", (data: ExecutionMessage) => {
      setIsExecuting(false);
      setCurrentExecutionId(null);
      if (data.message) {
        setOutput(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${data.message}`]);
      }
    });
  }, [onMessage, toast]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (autoScroll && outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output, autoScroll]);

  const handleStartExecution = () => {
    if (!projectDescription.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide a project description before starting execution.",
        variant: "destructive",
      });
      return;
    }
    startExecutionMutation.mutate();
  };

  const handleStopExecution = () => {
    if (currentExecutionId) {
      stopExecutionMutation.mutate(currentExecutionId);
    }
  };

  const handleDownloadOutput = () => {
    const outputText = output.join('\n');
    const blob = new Blob([outputText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-output-${new Date().toISOString()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: "Execution output has been downloaded.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Execution Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Execution Configuration</CardTitle>
            <Button
              onClick={isExecuting ? handleStopExecution : handleStartExecution}
              disabled={startExecutionMutation.isPending || stopExecutionMutation.isPending}
              className={isExecuting ? "bg-destructive hover:bg-destructive/90" : "bg-success hover:bg-success/90"}
            >
              {isExecuting ? (
                <>
                  <StopCircle className="w-4 h-4 mr-2" />
                  Stop Execution
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Start Execution
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Project Description *
            </label>
            <Textarea
              rows={3}
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Describe your project and what you want to accomplish..."
              disabled={isExecuting}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Model Selection
              </label>
              <Select
                value={executionConfig.model}
                onValueChange={(value) => setExecutionConfig(prev => ({ ...prev, model: value }))}
                disabled={isExecuting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4">GPT-4</SelectItem>
                  <SelectItem value="llama-3.3-70b">Llama 3.3 70B</SelectItem>
                  <SelectItem value="claude-3">Claude-3</SelectItem>
                  <SelectItem value="mistral-large">Mistral Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Process Type
              </label>
              <Select
                value={executionConfig.processType}
                onValueChange={(value) => setExecutionConfig(prev => ({ ...prev, processType: value }))}
                disabled={isExecuting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="hierarchical">Hierarchical</SelectItem>
                  <SelectItem value="parallel">Parallel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Max Iterations
              </label>
              <Select
                value={executionConfig.maxIterations.toString()}
                onValueChange={(value) => setExecutionConfig(prev => ({ ...prev, maxIterations: parseInt(value) }))}
                disabled={isExecuting}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="verboseLogging"
                checked={executionConfig.verboseLogging}
                onCheckedChange={(checked) => 
                  setExecutionConfig(prev => ({ ...prev, verboseLogging: checked as boolean }))
                }
                disabled={isExecuting}
              />
              <label htmlFor="verboseLogging" className="text-sm text-slate-700 dark:text-slate-300">
                Verbose Logging
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="memoryEnabled"
                checked={executionConfig.memoryEnabled}
                onCheckedChange={(checked) => 
                  setExecutionConfig(prev => ({ ...prev, memoryEnabled: checked as boolean }))
                }
                disabled={isExecuting}
              />
              <label htmlFor="memoryEnabled" className="text-sm text-slate-700 dark:text-slate-300">
                Memory Enabled
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="agentCollaboration"
                checked={executionConfig.agentCollaboration}
                onCheckedChange={(checked) => 
                  setExecutionConfig(prev => ({ ...prev, agentCollaboration: checked as boolean }))
                }
                disabled={isExecuting}
              />
              <label htmlFor="agentCollaboration" className="text-sm text-slate-700 dark:text-slate-300">
                Agent Collaboration
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Execution Output */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Execution Output</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant={autoScroll ? "default" : "outline"}
                size="sm"
                onClick={() => setAutoScroll(!autoScroll)}
              >
                Auto-scroll: {autoScroll ? "ON" : "OFF"}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadOutput}>
                <Download className="w-3 h-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div
            ref={outputRef}
            className="bg-slate-900 dark:bg-slate-950 text-green-400 font-mono text-sm rounded-lg p-4 h-96 overflow-y-auto custom-scrollbar"
          >
            <div className="space-y-1">
              {output.length === 0 ? (
                <div className="text-slate-500">Waiting for execution to start...</div>
              ) : (
                output.map((line, index) => (
                  <div key={index} className={
                    line.includes("completed successfully") || line.includes("Completed") ? "text-green-400" :
                    line.includes("Error") || line.includes("Failed") ? "text-red-400" :
                    line.includes("Warning") ? "text-yellow-400" :
                    "text-blue-400"
                  }>
                    {line}
                  </div>
                ))
              )}
              {isExecuting && (
                <div className="text-blue-400 animate-pulse">
                  Execution in progress...
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
