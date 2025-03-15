import express,{Request,Response} from "express";
import { verifyuser } from "../../middleware/verifyuser";
import { share_brain } from "./service";
import { Database_Layer_Error, Service_Layer_Error } from "../../Error handling/error";
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/",async (req:Request,res:Response)=>{
    const jwt_data=req.email.email;
    try{
        const hashed_email=share_brain(jwt_data);
        res.status(200).json(hashed_email);
    }
    catch(err){
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
})