import z from 'zod';


export const UserSchema = z.object({
    userId: z.string().min(1, "UserId is required"),//wtf how tf is gonna pass id through frontend??
    fullName: z.string().min(5, "Full Name is required"),
    password: z.string().min(10, "Password is compulsory"),
    email: z.string().min(11, "Email is compulsory"),
    university: z.string().min(10, "Universoty Name is Compulsory"),//srsly wtf??
    universityID: z.string().min(10, "UniID give asap"),
})

export const loginSchema = z.object({
    email: z.string().min(1, "Email format not followed or something"),
    password: z.string().min(8, "MIn Length is 8")
})