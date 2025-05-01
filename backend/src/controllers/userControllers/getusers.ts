import { Request, Response } from 'express';
import { supabase } from '../../config/db.js';

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { data: users, error } = await supabase
            .from('userTable')
            .select('*');

        if (error) {
            console.error('Supabase error:', error);
            res.status(500).json({ 
                success: false,
                error: error.message 
            });
            return;
        }

        if (!users || users.length === 0) {
            res.status(404).json({
                success: false,
                message: 'No users found'
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: users
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ 
            success: false,
            error: 'Internal server error' 
        });
    }
}; 