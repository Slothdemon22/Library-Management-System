import { bookSchema } from '../../types/bookTypes.js';
import { supabase } from '../../config/db.js';
export const addBooks = async (req, res) => {
    try {
        const { title, author, genre, bookImage, bookDetails, quantity, bookSummary } = req.body;
        console.log("body :", req.body);
        if (bookSchema.safeParse(req.body).success === false) {
            console.error('Validation error:');
            res.status(400).json({ message: 'Invalid input data' });
            return;
        }
        const { data, error } = await supabase
            .from('bookTable')
            .insert([{ title, author, genre, bookImage, bookDetails, quantity, bookSummary }])
            .select('*');
        console.log("data :", data);
        if (error) {
            console.error('Error inserting book:', error);
            res.status(400).json({ message: 'error while adding book' });
            return;
        }
        res.status(201).json({ message: 'Book added successfully', book: data });
        return;
    }
    catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
