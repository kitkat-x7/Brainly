import express,{Response,Request} from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {z} from "zod";
import dotenv from 'dotenv'; 
dotenv.config(); 
import { LoginSchema } from "../../checker/zod";
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
const router=express.Router();
router.use(express.json());

router.post("/",async (req:Request,res:Response)=>{
    try{
        LoginSchema.parse(req.body);
        const {email,password}=req.body;
        const existing_user=await client.user.findFirst({
            where:{
                email
            }
        });
        if(!existing_user || !existing_user.status){
            res.status(201).json({
                message:"User not Registered",
            });
            return;
        }     
        const verify=await bcrypt.compare(password,existing_user.password);
        if(!verify){
            res.status(201).json({
                message:"Wrong Password",
            });
            return;
        }
        const JWT_SECRET = process.env.JWT_SECRET; // Fix typo
        if (!JWT_SECRET) {
            res.status(201).json({
                message:"JWT Secret not configured yet.",
            });
            return;
        }
        const token =jwt.sign({email},JWT_SECRET,{ expiresIn: "1h" });
        const time=3600*1000;
        res.cookie("token",token,{
            maxAge:time,
        })
        res.status(201).json({
            message:"Logged In",
        });
        return;
    }catch(err){
        console.log("Error Encountered",err);
        if(err instanceof z.ZodError){
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            });
        }else{
            res.status(500).json({
                message:"Server Fault",
                error:err,
            });
        }
    }
});
export default router;