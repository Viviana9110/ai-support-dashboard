import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .min(2, "Last name is required"),

  email: z
    .string()
    .email("Invalid email"),

  company: z
    .string()
    .min(2, "Company is required"),

  role: z
    .string()
    .min(2, "Role is required"),

  phone: z.string(),

  bio: z
    .string()
    .max(250, "Maximum 250 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name is required"),

  lastName: z
    .string()
    .min(2, "Last name is required"),

  email: z
    .string()
    .email("Invalid email"),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;