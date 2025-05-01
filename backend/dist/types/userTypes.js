import z from 'zod';
export const registerSchema = z.object({
    name: z.string().min(2, { message: "Full Name must be at least 2 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    email: z.string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" })
        .min(5, { message: "Email is required" }),
});
export const loginSchema = z.object({
    email: z.string().min(1, "Email format not followed or something"),
    password: z.string().min(8, "MIn Length is 8")
});
