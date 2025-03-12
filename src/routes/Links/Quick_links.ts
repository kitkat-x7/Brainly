import express,{Request,Response} from "express";
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { verifyuser } from "../../middleware/verifyuser";
const router=express.Router();
router.use(express.json());
router.use(verifyuser);

router.get("/:type",async (req:Request,res:Response) => {
    const jwt_data=req.email.email;
    const type=req.params.type;
    try{
        const data=await client.content.findMany({
            where:{
                useremail:jwt_data,
                type
            },select:{
                type:true,
                link:true,
                description:true,
            }
        });
        if(!data){
            res.status(404).json({ message: "No content yet" });
            return;
        }
        res.status(200).json({
            data
        });
        return;
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});
export default router;