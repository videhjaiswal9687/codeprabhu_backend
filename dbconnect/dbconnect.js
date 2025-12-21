import mongoose from "mongoose";

const dbConnect = async (MONGO_URI) => {
    await mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
        process.exit(1); // Exit process with failure
    });
}

export default dbConnect;