import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import { authrouter } from './routes/authRoutes.js';
import { bookrouter } from './routes/bookroutes.js';
import adminRoutes from './routes/adminRoutes.js';
const app = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}));
// Use user routes
app.use('/api/auth', authrouter);
app.use('/api/books', bookrouter);
app.use('/api/admin', adminRoutes);
const port = process.env.PORT;
app.listen(port || 3000, () => {
    console.log(`Server is running on port ${port}`);
});
