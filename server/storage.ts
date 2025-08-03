import { type Agent, type InsertAgent, type Task, type InsertTask, type Crew, type InsertCrew, type Template, type InsertTemplate, type File, type InsertFile, type Execution, type InsertExecution } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Agent operations
  getAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | undefined>;
  createAgent(agent: InsertAgent): Promise<Agent>;
  updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined>;
  deleteAgent(id: string): Promise<boolean>;

  // Task operations
  getTasks(): Promise<Task[]>;
  getTask(id: string): Promise<Task | undefined>;
  getTasksByAgent(agentId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined>;
  deleteTask(id: string): Promise<boolean>;

  // Crew operations
  getCrews(): Promise<Crew[]>;
  getCrew(id: string): Promise<Crew | undefined>;
  createCrew(crew: InsertCrew): Promise<Crew>;
  updateCrew(id: string, updates: Partial<Crew>): Promise<Crew | undefined>;
  deleteCrew(id: string): Promise<boolean>;

  // Template operations
  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined>;
  deleteTemplate(id: string): Promise<boolean>;

  // File operations
  getFiles(): Promise<File[]>;
  getFile(id: string): Promise<File | undefined>;
  createFile(file: InsertFile): Promise<File>;
  deleteFile(id: string): Promise<boolean>;

  // Execution operations
  getExecutions(): Promise<Execution[]>;
  getExecution(id: string): Promise<Execution | undefined>;
  createExecution(execution: InsertExecution): Promise<Execution>;
  updateExecution(id: string, updates: Partial<Execution>): Promise<Execution | undefined>;
}

export class MemStorage implements IStorage {
  private agents: Map<string, Agent> = new Map();
  private tasks: Map<string, Task> = new Map();
  private crews: Map<string, Crew> = new Map();
  private templates: Map<string, Template> = new Map();
  private files: Map<string, File> = new Map();
  private executions: Map<string, Execution> = new Map();

  constructor() {
    this.initializeTemplates();
    this.initializeCrews();
  }

  private initializeTemplates() {
    const defaultTemplates: Template[] = [
      {
        id: randomUUID(),
        name: "Research & Analysis Team",
        description: "Comprehensive market research and data analysis team with specialized agents for different research methodologies.",
        category: "Research",
        rating: 4.8,
        downloads: 1247,
        configuration: {
          agents: [
            { role: "Market Analyst", goal: "Analyze market trends and competitive landscape", backstory: "Senior analyst with 10+ years experience in market research" },
            { role: "Data Scientist", goal: "Process and analyze quantitative data", backstory: "Expert in statistical analysis and data modeling" },
            { role: "Research Coordinator", goal: "Coordinate research activities and synthesize findings", backstory: "Project management specialist with research background" }
          ],
          tasks: [
            { name: "Market Analysis", description: "Conduct comprehensive market analysis" },
            { name: "Data Processing", description: "Clean and analyze collected data" },
            { name: "Competitive Intelligence", description: "Gather intelligence on competitors" },
            { name: "Trend Analysis", description: "Identify emerging market trends" },
            { name: "Final Report", description: "Synthesize findings into executive report" }
          ]
        },
        author: "CrewAI Team",
        featured: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: randomUUID(),
        name: "Content Creation Squad",
        description: "Professional content creation team for blogs, social media, and marketing materials with SEO optimization.",
        category: "Marketing",
        rating: 4.6,
        downloads: 892,
        configuration: {
          agents: [
            { role: "Content Writer", goal: "Create engaging and informative content", backstory: "Professional writer with expertise in various content formats" },
            { role: "SEO Specialist", goal: "Optimize content for search engines", backstory: "SEO expert with proven track record of improving rankings" }
          ],
          tasks: [
            { name: "Content Strategy", description: "Develop content strategy and calendar" },
            { name: "Blog Posts", description: "Write high-quality blog posts" },
            { name: "SEO Optimization", description: "Optimize content for search engines" },
            { name: "Social Media Content", description: "Create social media posts and campaigns" }
          ]
        },
        author: "MarketingPro",
        featured: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  private initializeCrews() {
    const defaultCrews: Crew[] = [
      {
        id: randomUUID(),
        name: "Research & Analysis Crew",
        description: "Advanced AI research team specializing in market analysis, competitive intelligence, and strategic insights",
        status: "running",
        progress: 75,
        agentIds: ["agent-1", "agent-2", "agent-3"],
        taskIds: ["task-1", "task-2", "task-3"],
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Content Creation Pipeline",
        description: "Multi-agent content creation system for blogs, social media, and marketing materials",
        status: "completed",
        progress: 100,
        agentIds: ["agent-4", "agent-5", "agent-6"],
        taskIds: ["task-4", "task-5", "task-6"],
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Customer Support Automation",
        description: "AI-powered customer support system with ticket routing, response generation, and resolution tracking",
        status: "pending",
        progress: 25,
        agentIds: ["agent-7", "agent-8"],
        taskIds: ["task-7", "task-8"],
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Financial Analysis Team",
        description: "Comprehensive financial modeling and analysis crew for investment decisions and portfolio management",
        status: "draft",
        progress: 10,
        agentIds: ["agent-9", "agent-10", "agent-11"],
        taskIds: ["task-9", "task-10"],
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Product Development Insights",
        description: "AI crew focused on product research, user feedback analysis, and feature prioritization",
        status: "failed",
        progress: 45,
        agentIds: ["agent-12", "agent-13"],
        taskIds: ["task-11", "task-12"],
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        updatedAt: new Date(),
      },
      {
        id: randomUUID(),
        name: "Sales Intelligence Crew",
        description: "Advanced sales analytics and lead scoring system with automated outreach capabilities",
        status: "running",
        progress: 60,
        agentIds: ["agent-14", "agent-15", "agent-16"],
        taskIds: ["task-13", "task-14", "task-15"],
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        updatedAt: new Date(),
      },
    ];

    defaultCrews.forEach(crew => {
      this.crews.set(crew.id, crew);
    });
  }

  // Agent operations
  async getAgents(): Promise<Agent[]> {
    return Array.from(this.agents.values());
  }

  async getAgent(id: string): Promise<Agent | undefined> {
    return this.agents.get(id);
  }

  async createAgent(insertAgent: InsertAgent): Promise<Agent> {
    const id = randomUUID();
    const agent: Agent = {
      ...insertAgent,
      id,
      status: "idle",
      tasksCompleted: 0,
      performanceScore: 0,
      createdAt: new Date(),
    };
    this.agents.set(id, agent);
    return agent;
  }

  async updateAgent(id: string, updates: Partial<Agent>): Promise<Agent | undefined> {
    const agent = this.agents.get(id);
    if (!agent) return undefined;
    
    const updatedAgent = { ...agent, ...updates };
    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  async deleteAgent(id: string): Promise<boolean> {
    return this.agents.delete(id);
  }

  // Task operations
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: string): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async getTasksByAgent(agentId: string): Promise<Task[]> {
    return Array.from(this.tasks.values()).filter(task => task.agentId === agentId);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const id = randomUUID();
    const task: Task = {
      ...insertTask,
      id,
      status: "pending",
      progress: 0,
      createdAt: new Date(),
      completedAt: null,
    };
    this.tasks.set(id, task);
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    if (updates.status === "completed" && !task.completedAt) {
      updatedTask.completedAt = new Date();
      updatedTask.progress = 100;
    }
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    return this.tasks.delete(id);
  }

  // Crew operations
  async getCrews(): Promise<Crew[]> {
    return Array.from(this.crews.values());
  }

  async getCrew(id: string): Promise<Crew | undefined> {
    return this.crews.get(id);
  }

  async createCrew(insertCrew: InsertCrew): Promise<Crew> {
    const id = randomUUID();
    const crew: Crew = {
      ...insertCrew,
      id,
      status: "pending",
      progress: 0,
      startedAt: null,
      completedAt: null,
      createdAt: new Date(),
    };
    this.crews.set(id, crew);
    return crew;
  }

  async updateCrew(id: string, updates: Partial<Crew>): Promise<Crew | undefined> {
    const crew = this.crews.get(id);
    if (!crew) return undefined;
    
    const updatedCrew = { ...crew, ...updates };
    if (updates.status === "running" && !crew.startedAt) {
      updatedCrew.startedAt = new Date();
    }
    if (updates.status === "completed" && !crew.completedAt) {
      updatedCrew.completedAt = new Date();
      updatedCrew.progress = 100;
    }
    this.crews.set(id, updatedCrew);
    return updatedCrew;
  }

  async deleteCrew(id: string): Promise<boolean> {
    return this.crews.delete(id);
  }

  // Template operations
  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = randomUUID();
    const template: Template = {
      ...insertTemplate,
      id,
      rating: 0,
      downloads: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async updateTemplate(id: string, updates: Partial<Template>): Promise<Template | undefined> {
    const template = this.templates.get(id);
    if (!template) return undefined;
    
    const updatedTemplate = { ...template, ...updates, updatedAt: new Date() };
    this.templates.set(id, updatedTemplate);
    return updatedTemplate;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }

  // File operations
  async getFiles(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  async getFile(id: string): Promise<File | undefined> {
    return this.files.get(id);
  }

  async createFile(insertFile: InsertFile): Promise<File> {
    const id = randomUUID();
    const file: File = {
      ...insertFile,
      id,
      downloads: 0,
      createdAt: new Date(),
    };
    this.files.set(id, file);
    return file;
  }

  async deleteFile(id: string): Promise<boolean> {
    return this.files.delete(id);
  }

  // Execution operations
  async getExecutions(): Promise<Execution[]> {
    return Array.from(this.executions.values());
  }

  async getExecution(id: string): Promise<Execution | undefined> {
    return this.executions.get(id);
  }

  async createExecution(insertExecution: InsertExecution): Promise<Execution> {
    const id = randomUUID();
    const execution: Execution = {
      ...insertExecution,
      id,
      startedAt: new Date(),
      completedAt: null,
    };
    this.executions.set(id, execution);
    return execution;
  }

  async updateExecution(id: string, updates: Partial<Execution>): Promise<Execution | undefined> {
    const execution = this.executions.get(id);
    if (!execution) return undefined;
    
    const updatedExecution = { ...execution, ...updates };
    if (updates.status === "completed" && !execution.completedAt) {
      updatedExecution.completedAt = new Date();
    }
    this.executions.set(id, updatedExecution);
    return updatedExecution;
  }
}

export const storage = new MemStorage();
