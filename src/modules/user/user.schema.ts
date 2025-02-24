import { z } from "zod";

const userCore = {
  email: z.string().email(),
  name: z.string(),
};

const CreateUserSchema = z.object({
  ...userCore,
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

const CreateUserResponseSchema = z.object({
  id: z.number(),
  ...userCore,
});

const LoginResponseSchema = z.object({
  accessToken: z.string(),
});

// ✅ Export inferred TypeScript types
export type CreateUserSchema = z.infer<typeof CreateUserSchema>;
export type LoginSchema = z.infer<typeof LoginSchema>;
export type CreateUserResponseSchema = z.infer<typeof CreateUserResponseSchema>;
export type LoginResponseSchema = z.infer<typeof LoginResponseSchema>;