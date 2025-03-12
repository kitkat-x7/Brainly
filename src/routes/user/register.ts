import express,{Response,Request} from "express";
import bcrypt from "bcrypt";
import {z} from "zod";
import { UserSchema } from "../../checker/zod";
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
const router=express.Router();
router.use(express.json());

router.post("/",async (req:Request,res:Response)=>{
    try{
        UserSchema.parse(req.body);
        const {email,password,name,phone_number}=req.body;
        const existing_user=await client.user.findFirst({
            where:{
                email,
            }
        });
        if(existing_user && existing_user.status){
            res.status(403).json({
                message:"existing",
            });
            return
        }
        const hashed_password=await bcrypt.hash(password,10);
        await client.user.create({
            data:{
                email,
                password:hashed_password,
                name,
                phone_number
            }
        });
        res.status(201).json({
            message:"Registered",
        });
        return;
    }catch(err){    
        console.log("Error Occured",err);
        if(err instanceof z.ZodError){
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }else{
            res.status(500).json({
                message:"Server Fault",
                error:err,
            })
        }
    }
});
export default router;