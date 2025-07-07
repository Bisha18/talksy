import express from 'express'
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv'
import connectDB from './lib/db.js'
import cookieParser from 'cookie-parser'
dotenv.config()

const port = process.env.PORT || 5001

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);

app.listen(port,()=>{
  console.log("server is running on port 5001");
  connectDB();
})