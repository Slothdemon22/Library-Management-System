import sql from 'mssql';
import config from './config/config.js';
import express from 'express';

import { BookQueries } from './database/bookQueries.js';
import { database } from './database/dbController.js'

const app = express();



app.get('/', async (req, res) => {

  const respsonse = await BookQueries.getBookInstance().getBooks(1);
  console.log(respsonse)
  res.send(respsonse)
  
})


const PORT = process.env.PORT || 3000;
app.listen(3000, function listener(){

  console.log(`App runnng on port ${PORT} `)
})