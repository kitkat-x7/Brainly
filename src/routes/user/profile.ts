import express,{Response,Request} from "express";
import {z} from "zod";
import { UserSchema } from "../../checker/zod";
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { verifyuser } from "../../middleware/verifyuser";
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/",async (req:Request,res:Response)=>{
    const jwt_data=req.email.email;
    try{
        const Data=await client.user.findUnique({
            where:{
                email:jwt_data,
            }
        });
        if(!Data || !Data.status){
            res.status(404).json({ message: "User not found" });
            return;
        }
        
        res.status(200).json({
            email:Data.email,
            name:Data.name,
            phone_number: Data.phone_number ,
        });
        return;
    }catch(error){
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal Server Error", error: error });
        return;
    }
});

router.patch("/",async (req:Request,res:Response)=>{
    const jwt_data=req.email.email;
    try{
        UserSchema.parse(req.body);
        const {name,phone_number}=req.body;
        const Data=await client.user.update({
            where: {
              email: jwt_data,
            },
            data: {
              name,
              phone_number
            },
          })
        if(!Data || !Data.status){
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(201).json({
            message:"Profile Updated",
        });
        return;
    }catch(error){
        console.error("Error occurred:", error);
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Validation Error", errors: error.errors });
        }else{
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
});

router.delete("/",async (req:Request,res:Response)=>{
    const jwt_data=req.email.email;
    try{
        const Data=await client.user.update({
            where: {
              email: jwt_data,
            },
            data:{
                status:false,
            }
        });
        if(!Data || !Data.status){
            res.status(404).json({ message: "User not found" });
            return;
        }
        //redirect to Signup
        res.clearCookie('token');
        res.status(201).send("User Deleted.").redirect("abc.com");
        return;
    }catch(error){
        console.error("Error occurred:", error);
        res.status(500).json({ message: "Internal Server Error", error: error});
    }
});
export default router;