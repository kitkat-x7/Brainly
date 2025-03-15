import express,{Request,Response} from "express";
import {z} from "zod";

import { ContentSchema } from "../../controllers/zod";
import { verifyuser } from "../../middleware/verifyuser";
import { Create_Content_Data, Delete_Content_Data, Get_Content, Get_Content_Specific, Update_Content_Data } from "./service";
import { Database_Layer_Error, Service_Layer_Error } from "../../Error handling/error";

const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.post("/",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        ContentSchema.parse(req.body);
        const {title,link,description,tags}=req.body;
        const Data={
            email:jwt_data,
            title,
            link,
            description,
            tags
        }
        await Create_Content_Data(Data);
        res.status(201).json({
            message:"Brain Successfully created",
        });
        return;
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof z.ZodError){
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

router.patch("/:id",async (req:Request,res:Response)=>{
    try{
        const id=Number(req.params.id);
        const jwt_data=req.email.email;
        ContentSchema.parse(req.body);
        const {title,link,description,tags}=req.body;
        const Data={
            id,
            email:jwt_data,
            title,
            link,
            description,
            tags
        }
        await Update_Content_Data(Data);
        res.status(201).json({
            message:"Brain Successfully created",
        });
        return
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof z.ZodError){
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

router.delete("/:id",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        const id=Number(req.params.id);
        await Delete_Content_Data(id,jwt_data);
        res.status(201).json({
            message:"Content Deleted",
        });
        return;
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
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

router.get("/:emailid",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        const emailid=req.params.emailid;
        const email=req.body.email;
        const Data=await Get_Content(emailid,email,jwt_data);
        if(Data){
            res.status(200).json(Data);
            return;
        }else{
            res.status(404).json({ message: "No content yet" });
            return;
        }
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
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

router.get("/:emailid/:id",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        const emailid=req.params.emailid;
        const email=req.body.email;
        const id=Number(req.params.id);
        const Data=await Get_Content_Specific(emailid,email,jwt_data,id);
        if(Data){
            res.status(200).json(Data);
            return;
        }else{
            res.status(404).json({ message: "No content yet" });
            return;
        }
    }catch(err){
        if(err instanceof Service_Layer_Error){
            res.status(err.status).json({
                message:err.message,
            })
        }else if(err instanceof Database_Layer_Error){
            res.status(err.status).json({
                message:err.message,
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

export default router;