import { z } from "zod";

export const LoginDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type LoginDTO = z.infer<typeof LoginDTO>;
