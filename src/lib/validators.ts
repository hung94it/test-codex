import { z } from "zod";

export const noteFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  content: z.string().default(""),
  tags: z.array(z.string().min(1)).default([]),
  archived: z.boolean().default(false)
});

export type NoteFormValues = z.infer<typeof noteFormSchema>;

export const noteUpdateSchema = noteFormSchema.partial();

export const searchParamsSchema = z.object({
  query: z.string().optional(),
  archived: z
    .enum(["true", "false"])
    .optional()
    .transform((value) => value === "true")
});

export const noteFiltersSchema = z.object({
  query: z.string().optional(),
  archived: z.boolean().optional()
});
