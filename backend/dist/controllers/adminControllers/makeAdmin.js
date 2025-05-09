import { supabase } from "../../lib/db.js";
export const makeAdmin = async (req, res) => {
    try {
        console.log("Body : ", req.body);
        const { isadmin, clerkID } = req.body;
        const isAdminValue = isadmin === true ? 1 : 0;
        const { data, error } = await supabase
            .from("userTable")
            .update({ isadmin: isAdminValue })
            .eq("clerkID", clerkID)
            .select();
        if (error) {
            console.error("❌ Supabase insert error:", error.message);
            res.status(500).json({
                success: false,
                message: "Failed to insert isAdmin into userTable",
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "isAdmin value inserted successfully",
            data,
        });
        return;
    }
    catch (err) {
        console.error("🔥 Unexpected error:", err);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        return;
    }
};
