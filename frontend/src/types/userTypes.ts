import z from 'zod';


export const userSignUpSchema=z.object(
    {
        name:z.string().min(1,"Name Must Not Be Empty"),
        email:z.string().email("email is required"),
        password:z.string().min(8,"Minimum length is 8 characters")
    }
)


export const userSignInSchema=z.object(
    {
        email:z.string().email("Email is required"),
        password:z.string().min(8,"Minimum length is 8 characters")
    }
)