import {supabase} from '../../config/db.js'
import { Request, Response } from 'express';


import { loginSchema } from '../../types/userTypes.js';

export const login= async (req: Request, res: Response): Promise<void> => {
    console.log("body :",req.body)
    const { email, password } = req.body;

    // Validate the input data
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        console.error('Validation error:', result.error.format());
        res.status(400).json({ message: 'Invalid input data', errors: result.error.format() });
        return;
    }

    try {
        // Check if the user exists and password matches
        const { data: user, error } = await supabase
            .from('userTable')
            .select('*')
            .eq('email', email)
            .eq('password', password)
            .single();

        if (error) {
            console.error('Error fetching user:', error);
            res.status(400).json({ message: 'Invalid email or password' });
            return;
        }

        if (!user) {
            res.status(401).json({ message: 'Invalid email or password' });
            return;
        }

        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}