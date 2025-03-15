import express,{Request,Response} from "express";
import { verifyuser } from "../../middleware/verifyuser";
import { Query_search } from "./service";
import { Database_Layer_Error, Service_Layer_Error } from "../../Error handling/error";
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.post("/query-search",async (req:Request,res:Response)=>{
    try{
        const {query}=req.body;
        if(!query || typeof(query)!="string"){
            res.status(403).json({
                message:"Give a proper query",
            });
            return;
        } 
        const data=await Query_search(query);
        res.status(200).json(data);
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

router.post("/query-search-by-tags",async (req:Request,res:Response)=>{
    try{
        const {tags}=req.body;
        let query:string='';
        for(let tag of tags){
            query=query+tag+" ";
        }
        const data=await Query_search(query);
        res.status(200).json(data);
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

export default router;