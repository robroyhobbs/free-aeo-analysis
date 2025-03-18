import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Analysis table
export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  timestamp: text("timestamp").notNull(), // ISO string
  overallScore: integer("overall_score").notNull(),
  summary: text("summary").notNull(),
  scoreSummary: text("score_summary").notNull(), // JSON string
  scoreBreakdown: text("score_breakdown").notNull(), // JSON string
  recommendations: text("recommendations").notNull(), // JSON string
});

export const insertAnalysisSchema = createInsertSchema(analyses).omit({
  id: true,
});

export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Analysis = typeof analyses.$inferSelect;

// URL validation schema
export const validUrlSchema = z.object({
  url: z.string().url("Please enter a valid URL")
});
