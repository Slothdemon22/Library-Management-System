import z from 'zod';
export const bookSchema = z.object({
    title: z.string().trim().min(3, "MIn length is 3 characters"),
    author: z.string().trim().min(3, "Min Charachters 3"),
    genre: z.string().trim().min(3, "Min Min Charachters 3"),
    bookImage: z.string().trim().min(5, "Min Charachters 3"),
    bookDetails: z.string().trim().min(10, "10 Characters min"),
    quantity: z.number().max(100, "Cannot Exceed 100").optional(),
    bookSummary: z.string().trim().min(100, "Summary cannot be less than 100 charcaters"),
});
