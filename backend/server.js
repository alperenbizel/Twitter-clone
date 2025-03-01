import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './connect/db.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.use("/api/auth",authRoutes);

const Port=process.env.PORT || 5000;

app.listen(Port, () => {
    console.log(`Server is running on port http://localhost:${Port}/`);
    connectMongoDB();
});