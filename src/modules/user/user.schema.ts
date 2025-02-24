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
export type CreateUserSchemaType = z.infer<typeof CreateUserSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
export type CreateUserResponseSchemaType = z.infer<typeof CreateUserResponseSchema>;
export type LoginResponseSchemaType = z.infer<typeof LoginResponseSchema>;

// ✅ Export schemas
export { CreateUserSchema, LoginSchema, CreateUserResponseSchema, LoginResponseSchema };