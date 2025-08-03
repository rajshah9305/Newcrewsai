import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertAgentSchema, insertTaskSchema, insertCrewSchema, insertTemplateSchema, insertFileSchema, insertExecutionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time execution monitoring
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong' }));
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Broadcast to all connected WebSocket clients
  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  // Agent routes
  app.get("/api/agents", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      res.json(agents);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch agents" });
    }
  });

  app.post("/api/agents", async (req, res) => {
    try {
      const validatedData = insertAgentSchema.parse(req.body);
      const agent = await storage.createAgent(validatedData);
      res.status(201).json(agent);
    } catch (error) {
      res.status(400).json({ message: "Invalid agent data" });
    }
  });

  app.put("/api/agents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const agent = await storage.updateAgent(id, req.body);
      if (!agent) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json(agent);
    } catch (error) {
      res.status(400).json({ message: "Failed to update agent" });
    }
  });

  app.delete("/api/agents/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteAgent(id);
      if (!deleted) {
        return res.status(404).json({ message: "Agent not found" });
      }
      res.json({ message: "Agent deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete agent" });
    }
  });

  // Task routes
  app.get("/api/tasks", async (req, res) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post("/api/tasks", async (req, res) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ message: "Invalid task data" });
    }
  });

  app.put("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const task = await storage.updateTask(id, req.body);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(400).json({ message: "Failed to update task" });
    }
  });

  app.delete("/api/tasks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTask(id);
      if (!deleted) {
        return res.status(404).json({ message: "Task not found" });
      }
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // Crew routes
  app.get("/api/crews", async (req, res) => {
    try {
      const crews = await storage.getCrews();
      res.json(crews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch crews" });
    }
  });

  app.post("/api/crews", async (req, res) => {
    try {
      const validatedData = insertCrewSchema.parse(req.body);
      const crew = await storage.createCrew(validatedData);
      res.status(201).json(crew);
    } catch (error) {
      res.status(400).json({ message: "Invalid crew data" });
    }
  });

  app.put("/api/crews/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const crew = await storage.updateCrew(id, req.body);
      if (!crew) {
        return res.status(404).json({ message: "Crew not found" });
      }
      res.json(crew);
    } catch (error) {
      res.status(400).json({ message: "Failed to update crew" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/templates/load/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const template = await storage.getTemplate(id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      
      // Increment download count
      await storage.updateTemplate(id, { downloads: template.downloads + 1 });
      
      res.json(template.configuration);
    } catch (error) {
      res.status(500).json({ message: "Failed to load template" });
    }
  });

  // File routes
  app.get("/api/files", async (req, res) => {
    try {
      const files = await storage.getFiles();
      res.json(files);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  app.post("/api/files/:id/download", async (req, res) => {
    try {
      const { id } = req.params;
      const file = await storage.getFile(id);
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }
      
      // In a real implementation, this would serve the actual file
      // For now, we'll just increment the download counter
      await storage.updateFile(id, { downloads: file.downloads + 1 });
      
      res.json({ message: "Download started", filename: file.name });
    } catch (error) {
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  // Execution routes
  app.post("/api/executions", async (req, res) => {
    try {
      const validatedData = insertExecutionSchema.parse(req.body);
      const execution = await storage.createExecution(validatedData);
      
      // Start execution simulation
      simulateExecution(execution.id, broadcast);
      
      res.status(201).json(execution);
    } catch (error) {
      res.status(400).json({ message: "Invalid execution data" });
    }
  });

  app.get("/api/executions/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const execution = await storage.getExecution(id);
      if (!execution) {
        return res.status(404).json({ message: "Execution not found" });
      }
      res.json(execution);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch execution" });
    }
  });

  app.put("/api/executions/:id/stop", async (req, res) => {
    try {
      const { id } = req.params;
      const execution = await storage.updateExecution(id, { status: "failed" });
      if (!execution) {
        return res.status(404).json({ message: "Execution not found" });
      }
      
      broadcast({
        type: 'execution_stopped',
        executionId: id,
        message: 'Execution stopped by user'
      });
      
      res.json(execution);
    } catch (error) {
      res.status(500).json({ message: "Failed to stop execution" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/overview", async (req, res) => {
    try {
      const agents = await storage.getAgents();
      const tasks = await storage.getTasks();
      const crews = await storage.getCrews();
      const executions = await storage.getExecutions();

      const activeCrews = crews.filter(crew => crew.status === "running").length;
      const completedTasks = tasks.filter(task => task.status === "completed").length;
      const totalTasks = tasks.length;
      const successRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const completedExecutions = executions.filter(ex => ex.status === "completed");
      const avgDuration = completedExecutions.length > 0 
        ? completedExecutions.reduce((sum, ex) => sum + ex.duration, 0) / completedExecutions.length 
        : 0;

      res.json({
        activeCrews,
        totalTasks,
        successRate: Math.round(successRate * 10) / 10,
        avgDuration: Math.round(avgDuration),
        totalAgents: agents.length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  return httpServer;
}

// Simulate execution for demo purposes
async function simulateExecution(executionId: string, broadcast: (data: any) => void) {
  const steps = [
    "Initializing CrewAI execution environment...",
    "Loading configured agents and tasks...",
    "Starting market entry strategy development...",
    "Market Analyst: Beginning competitive landscape analysis...",
    "Strategy Consultant: Analyzing target market demographics...",
    "Research Agent: Collecting market size and growth data...",
    "Market Analyst: Found 47 direct competitors in the space...",
    "Strategy Consultant: Identified 3 key customer segments...",
    "Research Agent: Market size estimated at $2.4B with 12% CAGR...",
    "Market Analyst: Completing SWOT analysis framework...",
    "Strategy Consultant: Developing go-to-market strategies...",
    "Research Agent: Analyzing pricing models and positioning...",
    "Market Analyst: Generating competitive positioning matrix...",
    "Strategy Consultant: Creating customer acquisition funnel...",
    "Research Agent: Finalizing market entry recommendations...",
    "All agents: Collaborating on executive summary...",
    "Execution completed successfully!"
  ];

  let stepIndex = 0;
  let tokensUsed = 8247;
  let apiCalls = 23;
  let cost = 1.47;

  const interval = setInterval(async () => {
    if (stepIndex < steps.length) {
      const step = steps[stepIndex];
      const timestamp = new Date().toLocaleTimeString();
      
      // Update execution in storage
      await storage.updateExecution(executionId, {
        output: step,
        tokensUsed: tokensUsed + stepIndex * 234,
        apiCalls: apiCalls + stepIndex * 2,
        estimatedCost: cost + stepIndex * 0.08,
        duration: stepIndex * 8
      });

      // Broadcast update to WebSocket clients
      broadcast({
        type: 'execution_update',
        executionId,
        step,
        timestamp,
        progress: Math.round((stepIndex / steps.length) * 100),
        metrics: {
          tokensUsed: tokensUsed + stepIndex * 234,
          apiCalls: apiCalls + stepIndex * 2,
          estimatedCost: cost + stepIndex * 0.08,
          duration: stepIndex * 8
        }
      });

      stepIndex++;
    } else {
      // Mark execution as completed
      await storage.updateExecution(executionId, {
        status: "completed",
        duration: stepIndex * 8
      });

      broadcast({
        type: 'execution_completed',
        executionId,
        message: 'Execution completed successfully!'
      });

      clearInterval(interval);
    }
  }, 2000);
}
