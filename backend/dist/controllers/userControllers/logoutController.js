export const logout = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        message: "Logout successful",
        status: 200,
    });
};
