import express,{Response,Request} from "express";
import { login_service, register_service } from "./service";
import {z} from "zod";
import { UserSchema } from "../../../controllers/zod";
import { Database_Layer_Error, Service_Layer_Error } from "../../../Error handling/error";
const router=express.Router();
router.use(express.json());

router.post("/register",async (req:Request,res:Response)=>{
    try{
        UserSchema.parse(req.body);
        const {email,password,name,phone_number}=req.body;
        const data={
            email,
            password,
            name,
            phone_number,
        }
        await register_service(data);
        res.status(201).json({
            message:"Registered",
        });
    }catch(err){   
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof z.ZodError){
            console.error("Error Occured",err);
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

router.post("/login",async (req:Request,res:Response)=>{
    try{
        UserSchema.parse(req.body);
        const {email,password}=req.body;
        const data={
            email,
            password
        }
        const token=await login_service(data);
        const time=3600*1000;
        res.cookie("token",token,{
            maxAge:time,
        })
        res.status(201).json({
            message:"Logged In",
        });
        
    }catch(err){    
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }
        else if(err instanceof z.ZodError){
            console.error("Error Occured",err);
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});


router.get("/logout",(req:Request,res:Response)=>{
    res.clearCookie('token');
    res.status(200).json({
        message:"User Logged Out!",
    });
    return;
})
export default router;