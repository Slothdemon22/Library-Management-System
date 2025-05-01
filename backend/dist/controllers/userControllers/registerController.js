import { supabase } from "../../config/db.js";
import { registerSchema } from "../../types/userTypes.js";
export const registerUser = async (req, res) => {
    console.log("body :", req.body);
    const { name, email, password } = req.body;
    // Validate the input data
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
        console.error('Validation error:', result.error.format());
        res.status(400).json({ message: 'Invalid input data', errors: result.error.format() });
        return;
    }
    const { data: exisitingUser, error: existingUserError } = await supabase
        .from('userTable')
        .select('*')
        .eq('email', email)
        .single();
    console.log("exisitingUser :", exisitingUser);
    if (exisitingUser) {
        console.error('Error checking existing user:', exisitingUser);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
    try {
        // Create a new user
        const { data, error } = await supabase
            .from('userTable')
            .insert([{ name, email, password }])
            .select('*');
        console.log("data :", data);
        res.status(201).json({ message: 'User registered successfully', user: data });
        return;
    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
    }
};
