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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "*", // later you can restrict to your Vercel domain
}));

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


//routes
app.use('/', indexRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export default app; 