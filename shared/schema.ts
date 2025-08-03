import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const agents = pgTable("agents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  role: text("role").notNull(),
  goal: text("goal").notNull(),
  backstory: text("backstory").notNull(),
  model: text("model").notNull().default("gpt-4"),
  temperature: real("temperature").notNull().default(0.7),
  maxIterations: integer("max_iterations").notNull().default(5),
  tools: jsonb("tools").default([]),
  status: text("status").notNull().default("idle"), // idle, active, busy
  tasksCompleted: integer("tasks_completed").notNull().default(0),
  performanceScore: real("performance_score").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const tasks = pgTable("tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  expectedOutput: text("expected_output").notNull(),
  agentId: varchar("agent_id").references(() => agents.id),
  priority: text("priority").notNull().default("medium"), // urgent, high, medium, low
  status: text("status").notNull().default("pending"), // pending, in_progress, completed, failed
  outputFormat: text("output_format").notNull().default("text"),
  dueDate: timestamp("due_date"),
  progress: integer("progress").notNull().default(0),
  additionalContext: text("additional_context"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const crews = pgTable("crews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("pending"), // pending, running, completed, failed
  agentIds: jsonb("agent_ids").default([]),
  taskIds: jsonb("task_ids").default([]),
  progress: integer("progress").notNull().default(0),
  startedAt: timestamp("started_at"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  rating: real("rating").notNull().default(0),
  downloads: integer("downloads").notNull().default(0),
  configuration: jsonb("configuration").notNull(),
  author: text("author").notNull(),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const files = pgTable("files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  crewId: varchar("crew_id").references(() => crews.id),
  downloads: integer("downloads").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const executions = pgTable("executions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  crewId: varchar("crew_id").references(() => crews.id),
  status: text("status").notNull().default("running"), // running, completed, failed
  output: text("output").default(""),
  tokensUsed: integer("tokens_used").notNull().default(0),
  apiCalls: integer("api_calls").notNull().default(0),
  estimatedCost: real("estimated_cost").notNull().default(0),
  duration: integer("duration").notNull().default(0),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
  status: true,
  tasksCompleted: true,
  performanceScore: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
  status: true,
  progress: true,
});

export const insertCrewSchema = createInsertSchema(crews).omit({
  id: true,
  createdAt: true,
  startedAt: true,
  completedAt: true,
  status: true,
  progress: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  rating: true,
  downloads: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
  downloads: true,
});

export const insertExecutionSchema = createInsertSchema(executions).omit({
  id: true,
  startedAt: true,
  completedAt: true,
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = z.infer<typeof insertTaskSchema>;
export type Crew = typeof crews.$inferSelect;
export type InsertCrew = z.infer<typeof insertCrewSchema>;
export type Template = typeof templates.$inferSelect;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;
export type Execution = typeof executions.$inferSelect;
export type InsertExecution = z.infer<typeof insertExecutionSchema>;
