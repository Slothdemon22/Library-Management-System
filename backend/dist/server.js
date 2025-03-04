var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { connectDB } from './config/db.js';
import express from 'express';
import 'dotenv/config';
const app = express();
const connection = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pool = yield connectDB();
        console.log('✅ Connected to Azure SQL Database');
    }
    catch (error) {
        console.error('❌ Connection error:', error);
        process.exit(1);
    }
});
connection();
const port = process.env.PORT;
app.listen(port || 3000, () => {
    console.log(`Server is running on port ${port}`);
});
