import express from "express";
import connectDb from "./db/db.js";
import dotenv from 'dotenv';
import userRouter from './routes/userRoutes.js';
import notesRouter from './routes/notesRouter.js';
import cookieParser from "cookie-parser";


const app = express();
dotenv.config();
const port = process.env.PORT || 8081;

app.use(express.json());
app.use(cookieParser());


connectDb();

app.use('/api/v1/auth', userRouter);
app.use('/api/v1/notes', notesRouter);


app.listen(port, ()=>{console.log("application is running at port", port)})


