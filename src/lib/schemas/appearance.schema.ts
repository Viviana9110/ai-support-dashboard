import { z } from "zod";

export const appearanceSchema = z.object({
  theme: z.enum([
    "light",
    "dark",
    "system",
  ]),

  accent: z.enum([
    "blue",
    "emerald",
    "violet",
    "orange",
  ]),

  compactMode: z.boolean(),

  sidebarCollapsed: z.boolean(),

  animations: z.boolean(),
});

export type AppearanceFormData =
  z.infer<typeof appearanceSchema>;