var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { BookQueries } from './database/bookQueries.js';
const app = express();
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const respsonse = yield BookQueries.getBookInstance().getBooks(1);
    console.log(respsonse);
    res.send(respsonse);
}));
const PORT = process.env.PORT || 3000;
app.listen(3000, function listener() {
    console.log(`App runnng on port ${PORT} `);
});
