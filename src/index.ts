import express from "express";
const app = express();
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
app.use(express.json());
app.use(cookieParser());
import dotenv from 'dotenv'; 
dotenv.config(); 

import register from "./routes/user/register";
import login from "./routes/user/login";
import profile from "./routes/user/profile";
import logout from "./routes/user/logout";
import content from "./routes/content/content";
import quicklinks from "./routes/Links/Quick_links";
import serach from "./routes/Search/Query_Search";
import search_tags from "./routes/Search/Search_by_tags";

app.use("/api/v1/user/register",register);
app.use("/api/v1/user/login",login);
app.use("/api/v1/user/logout",logout);
app.use("/api/v1/user/profile",profile);
app.use("/api/v1/user/content",content);
app.use("/api/v1/user/links",quicklinks);
app.use("/api/v1/user/search/",serach);
app.use("/api/v1/user/search/tag",search_tags);

app.get("/api/v1/user/home",(req,res)=>{
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