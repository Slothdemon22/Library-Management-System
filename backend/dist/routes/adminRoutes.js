import express from 'express';
import { addBook } from '../controllers/bookControllers/addBooksController.js';
const adminRouter = express.Router();
adminRouter.post("/addBook", addBook);
adminRouter.post("/deleteBook");
adminRouter.post("/approveAccount");
adminRouter.post("/approveBorrowRequest");
export default adminRouter;
