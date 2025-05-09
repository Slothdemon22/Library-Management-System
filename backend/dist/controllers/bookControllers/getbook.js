import { supabase } from '../../config/db.js';
export const getAllBooks = async (req, res) => {
    try {
        const { data: books, error } = await supabase
            .from('bookTable')
            .select('*');
        console.log("books :", books);
        if (error) {
            console.error('Supabase error:', error);
            res.status(500).json({
                success: false,
                error: error.message
            });
            return;
        }
        if (!books || books.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No books found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: books
        });
    }
    catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
