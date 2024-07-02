import { z } from "zod";

export const userValidation = z.object({
    username: z.string().min(4, { message: "Username is required" }),
    password: z.string().min(6, { message: "Password is required" }),
    email: z.string().min(6, { message: "Email is required" }).email("Invalid email address"),
    avatar: z.string()
});