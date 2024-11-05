import { z } from "zod";

export const SignupDTO = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type SignupDTO = z.infer<typeof SignupDTO>;
