import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
app.use(express.json());
app.use(cookieParser());
import dotenv from 'dotenv'; 
dotenv.config(); 

import Auth from "./routes/user/Auth/routes";
import profile from "./routes/user/Profile/routes";
import content from "./routes/content/routing";
import quicklinks from "./routes/Links/routing";
import serach from "./routes/Search/routing";

app.use("/api/v2/user/",Auth);
app.use("/api/v2/user/profile",profile);
app.use("/api/v2/user/content",content);
app.use("/api/v2/user/links",quicklinks);
app.use("/api/v2/user/search/",serach);

app.get("/api/v2/user/home",(req,res)=>{
    res.json("Welcome");
});

const connectDB = async () => {
    try {
        const url=process.env.MONGO_URL;
        if(url){
            await mongoose.connect(url);
            console.log("✅ MongoDB connected successfully");
        }
    } catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1); 
    }
};
connectDB().then(()=>{
    app.listen(8080,()=>{
        console.log("Server is running on port 3000")
    });
}).catch((err)=>{
    console.error("❌ Failed to start server due to DB error:", err);
})