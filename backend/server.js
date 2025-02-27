import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import connectMongoDB from './connect/db.js';

dotenv.config();
const app = express();

console.log(process.env.MONGO_URI);

app.use("/api/auth",authRoutes);

const Port=process.env.PORT || 5000;

app.listen(Port, () => {
    console.log(`Server is running on port http://localhost:${Port}/`);
    connectMongoDB();
});