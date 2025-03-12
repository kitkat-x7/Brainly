import express,{Request,Response} from 'express';
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { verifyuser } from "../../middleware/verifyuser";
import bcrypt from "bcrypt";
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/",async (req:Request,res:Response)=>{
    const jwt_data=req.email.email;
    try{
        await client.user.update({
            where:{
                email:jwt_data
            },
            data:{
                share:true
            }
        });
        const hash=await bcrypt.hash(jwt_data,10);
        
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
})