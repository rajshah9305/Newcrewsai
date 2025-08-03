import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertAgentSchema } from "@shared/schema";
import type { InsertAgent } from "@shared/schema";

interface AgentFormProps {
  onClose: () => void;
}

export default function AgentForm({ onClose }: AgentFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [temperature, setTemperature] = useState(0.7);

  const form = useForm<InsertAgent>({
    resolver: zodResolver(insertAgentSchema),
    defaultValues: {
      role: "",
      goal: "",
      backstory: "",
      model: "gpt-4",
      temperature: 0.7,
      maxIterations: 5,
      tools: [],
    },
  });

  const createAgentMutation = useMutation({
    mutationFn: async (data: InsertAgent) => {
      const response = await apiRequest("POST", "/api/agents", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/agents"] });
      toast({
        title: "Success",
        description: "Agent created successfully!",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create agent. Please try again.",
        variant: "destructive",
      });
    },
  });

  const availableTools = [
    { id: "web_search", label: "Web Search" },
    { id: "file_reader", label: "File Reader" },
    { id: "calculator", label: "Calculator" },
    { id: "code_interpreter", label: "Code Interpreter" },
  ];

  const onSubmit = (data: InsertAgent) => {
    createAgentMutation.mutate(data);
  };

  const handleToolToggle = (toolId: string, checked: boolean) => {
    const currentTools = form.getValues("tools") as string[] || [];
    if (checked) {
      form.setValue("tools", [...currentTools, toolId]);
    } else {
      form.setValue("tools", currentTools.filter(t => t !== toolId));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Agent</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Data Analyst" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Analyze market trends and patterns" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="backstory"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Backstory *</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={3} 
                      placeholder="Describe the agent's background and expertise..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="llama-3.3-70b">Llama 3.3 70B</SelectItem>
                        <SelectItem value="claude-3">Claude-3</SelectItem>
                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temperature</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={1}
                          step={0.1}
                          value={[field.value]}
                          onValueChange={(value) => {
                            const newValue = value[0];
                            field.onChange(newValue);
                            setTemperature(newValue);
                          }}
                        />
                        <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                          {field.value}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxIterations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Iterations</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1} 
                        max={20} 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div>
              <FormLabel>Tools</FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                {availableTools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={tool.id}
                      onCheckedChange={(checked) => handleToolToggle(tool.id, checked as boolean)}
                    />
                    <label htmlFor={tool.id} className="text-sm text-slate-700 dark:text-slate-300">
                      {tool.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <Button 
                type="submit" 
                disabled={createAgentMutation.isPending}
              >
                {createAgentMutation.isPending ? "Creating..." : "Create Agent"}
              </Button>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
