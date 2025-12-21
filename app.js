import express from 'express';
import dbConnect from './dbconnect/dbconnect.js';
import dotenv from 'dotenv';
import indexRoutes from './routes/indexRoute.js';
import cors from 'cors';
import mongoose from "mongoose";

// Load environment variables
dotenv.config({ path: './config/config.env' });

const app = express();
const PORT = process.env.PORT || 3000;


//database connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
   console.log("MongoDB connected successfully");
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Mongo error:", err.message);
    process.exit(1);
  });

  app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // later you can restrict to your Vercel domain
}));

//routes
app.use('/', indexRoutes);


export default app; 