import express,{Response,Request} from "express";
import {z} from "zod";
import { UpdatedUserSchema } from "../../../controllers/zod";
import { verifyuser } from "../../../middleware/verifyuser";
import { Delete_Profile, Get_Profile, Update_Profile } from "./service";
import { Database_Layer_Error, Service_Layer_Error } from "../../../Error handling/error";
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        const Data=await Get_Profile(jwt_data);
        res.status(200).json({
            email:Data.email,
            name:Data.name,
            phone_number: Data.phone_number ,
        });
        return;
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
          }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
        }else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});


router.patch("/",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        UpdatedUserSchema.parse(req.body);
        const {name,phone_number}=req.body;
        const Data={
            email:jwt_data,
            name,
            phone_number
        }
        await Update_Profile(Data);
        res.status(201).json({
            message:"Profile Updated",
        });
        return;
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
          }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
        }else if(err instanceof z.ZodError){
            console.error("Error Occured",err);
            res.status(403).json({
                message:"Validation Error",
                error:err.message,
            })
        }
        else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

router.delete("/",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        await Delete_Profile(jwt_data);
        res.clearCookie('token');
        res.status(201).json({message:"User Deleted."});
        return;
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
          }
        else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            });
        }else{
            console.error("Error Occured",err);
            res.status(500).json({
                message:"Server Fault",
                error:err
            })
        }
    }
});

export default router;