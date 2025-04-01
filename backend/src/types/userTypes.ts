import z from 'zod';


export const UserSchema = z.object({
    fullName: z.string().min(5, { message: "Full Name must be at least 5 characters long" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters long" }),
    email: z.string()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Invalid email format" })
        .min(5, { message: "Email is required" }),
    university: z.string().min(3, { message: "University name must be at least 3 characters long" }).optional(),
});
export const loginSchema = z.object({
    email: z.string().min(1, "Email format not followed or something"),
    password: z.string().min(8, "MIn Length is 8")
})