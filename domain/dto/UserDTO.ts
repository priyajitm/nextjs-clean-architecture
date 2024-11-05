import { z } from "zod";

export const UserDTO = z.object({
  id: z.string(),
  email: z.string().email(),
  roles: z.array(z.enum(["user", "admin"] as const)),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type UserDTO = z.infer<typeof UserDTO>;
