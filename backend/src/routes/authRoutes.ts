import express, { Router } from 'express';
import { getAllUsers } from '../controllers/userControllers/getusers.js';
import { registerUser } from '../controllers/userControllers/registerController.js';
import { login } from '../controllers/userControllers/loginController.js';
import { getUserBorrowedBooks } from '../controllers/userControllers/getuserborrowedbooks.js';

const authrouter = express.Router();

// GET /api/users - Get all users
authrouter.get('/getusers', getAllUsers);
authrouter.post('/register', registerUser);
authrouter.post('/login', login)
authrouter.post('/getUserBorrowedBooks', getUserBorrowedBooks)

export {authrouter};
