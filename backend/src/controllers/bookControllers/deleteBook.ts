
import {supabase} from '../../config/db.js'
import { Request, Response } from 'express';


export const deleteBook = async (req: Request, res: Response): Promise<void> => {
 try{
    const {id}=req.body;
    console.log("id :",id)
    if (!id) {
        res.status(400).json({ message: 'Book ID is required' });
        return;
    }
    const { data, error } = await supabase
        .from('bookTable')
        .delete()
        .eq('id', id)
        .select('*');
    console.log("data :",data)
    if (error) {
        console.error('Error deleting book:', error);
        res.status(400).json({ message: 'Error while deleting book' });
        return;
    }
    if (!data || data.length === 0) {
        res.status(404).json({ message: 'Book not found' });
        return;
    }
    res.status(200).json({ message: 'Book deleted successfully', book: data });
    return;



 }catch(error){

        console.error('Error deleting book:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;

 }


}