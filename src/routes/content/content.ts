import express,{Request,Response} from "express";
import {string, z} from "zod";
import bcrypt from 'bcrypt';
import { ContentSchema } from "../../checker/zod";
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { verifyuser } from "../../middleware/verifyuser";
const { spawn } = require('child_process');
import { ContentModel } from "../../Vector_DB/Content_DB";

const router=express.Router();
router.use(express.json());
router.use(verifyuser);
async function create_embeddings(id:number,Data:string) {
    return new Promise<string>((resolve, reject) => {
        const python = spawn('python', ['path of embeddings',id,Data]);
        let output = '';
        let errorOutput = '';
        python.stdout.on('data', (data:any) => {
            output += data.toString();
        });
        python.stderr.on('data', (data:any) => {
            errorOutput += data.toString();
        });
        python.on('close', (code:any) => {
            if (code !== 0) {
                reject(`Process exited with code ${code}\nError Output:\n${errorOutput}`);
            } else {
                resolve(output.trim());
            }
        });
    })
}

router.post("/",async (req:Request,res:Response)=>{
    const jwt_data=req.email.email;
    try{
        ContentSchema.parse(req.body);
        const {title,link,description,tags}=req.body;
        const types=["yout","x.com","facebook","instagram","reddit","drive"];
        let search_data="",index_data=1000,D;
        for(let index of types){
            D=link.search(index);
            if(D!=-1){
                if(index_data>D){
                    index_data=D;
                    search_data=index;
                }
            }
        }
        const type=search_data;
        
        await client.content.create({
            data:{
                useremail:jwt_data,
                title,
                type,
                link,
                description,
            }
        });
        
        const content_data=await client.content.findFirst({
            where:{
                useremail:jwt_data,
                link,
            }
        });
        if(content_data){
            if(content_data.id!=null){
                console.log("Starting AI");
                await ContentModel.create({
                    content_id:content_data.id,
                    title,
                });
                console.log(await create_embeddings(content_data.id,title));
            }
            for(let tag of tags){
                const data_tag=await client.tag.findFirst({
                    where:{
                        tag,
                    }
                });
                if(data_tag){
                    await client.contentandtag.create({
                        data:{
                            contentid:content_data.id,
                            tagname:data_tag.tag,
                        }
                    });
                }else{
                    await client.tag.create({
                        data:{
                            tag,
                        }
                    });
                    const tag_data=await client.tag.findFirst({
                        where:{
                            tag,
                        }
                    });
                    if(tag_data){
                        await client.contentandtag.create({
                            data:{
                                contentid:content_data.id,
                                tagname:tag_data.tag,
                            }
                        });
                    }else{
                        res.status(404).json({
                            message:"No such tags found",
                        });
                        return;
                    }
                }
            }
        }else{
            res.status(404).json({
                message:"No such content found",
            });
            return;
        }
        res.status(201).send("Brain Successfully created");
        return;
    }catch(err){
        console.error("Error occurred:", err);
        if (err instanceof z.ZodError) {
            res.status(411).json({ message: "Validation Error", error: err.message });
        }else{
            res.status(500).json({
                message: "Internal Server Error"
            })
        }
    }
    
});

router.patch("/:id",async (req:Request,res:Response)=>{
    const id=Number(req.params.id);
    const jwt_data=req.email.email;
    try{
        const {title,link,description,tags}=req.body;
        if(typeof(description)!="string"){
            res.status(403).json({
                message:"validation Error"
            })
        }
        const data=await client.content.update({
            where:{
                title,
                id:id,
                useremail:jwt_data,
                link
            },
            data:{
                title,
                description,
            }
        });
        const previous_tags=await client.contentandtag.findMany({
            where:{
                contentid:data.id,
            }
        });
        for(let index in previous_tags){
            if(!tags.include(previous_tags[index].tagname)){
                await client.contentandtag.delete({
                    where:{
                        contenttagid:{
                            contentid:previous_tags[index].contentid,
                            tagname:previous_tags[index].tagname
                        }
                    }
                })
            }
        }
        for(let index in tags){
            if(!previous_tags.some(obj=>{
                obj.tagname===tags[index];
            })){
                await client.contentandtag.create({
                    data:{
                        contentid:data.id,
                        tagname:tags[index],
                    }
                });
            }
        }
        res.status(201).json({
            message:"Contents Updated",
        });
        return;
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({
            message: "Internal Server Error"
        })
    }
});

router.delete("/:id",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        const id=Number(req.params.id);
        await client.content.delete({
            where:{
                id:id,
                useremail:jwt_data
            }
        });
        res.status(201).json({
            message:"Content Deleted",
        })
    }catch(err){
        console.log("error received",err);
        res.status(500).json({ message: "Server Error",error:err });
    }
});

router.get("/:emailid",async (req:Request,res:Response)=>{
    try{
        const jwt_data=req.email.email;
        const emailid=req.params.emailid;
        const email=req.body.email;
        const verify_own=await bcrypt.compare(jwt_data,emailid);
        const verify_other=await bcrypt.compare(email,emailid);
        const data=await client.user.findFirst({
            where:{
                email
            },select:{
                share:true
            }
        });
        if(verify_own || (verify_other && data?.share)){
            const data1=await client.content.findMany({
                where:{
                    useremail:jwt_data
                },select:{
                    title:true,
                    type:true,
                    link:true,
                    description:true,
                }
            });
            if(!data1){
                res.status(404).json({ message: "No content yet" });
                return;
            }
            res.status(200).json({
                data1
            });
            return;
        }else{
            res.status(404).json({
                message:"Brain is private"
            });
            return;
        }
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});


router.get("/:emailid/:id",async (req:Request,res:Response)=>{
    try{
        const emailid=req.params.emailid;
        const id=Number(req.params.id);
        const email=req.body.email;
        const jwt_data=req.email.email;
        const verify_own=await bcrypt.compare(jwt_data,emailid);
        const verify_other=await bcrypt.compare(email,emailid);
        const data1=await client.user.findFirst({
            where:{
                email
            },select:{
                share:true
            }
        });
        if(verify_own || (verify_other && data1?.share)){
            const data=await client.content.findFirst({
                where:{
                    id,
                },select:{
                    title:true,
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
        }else{
            res.status(404).json({
                message:"Brain is private"
            });
            return;
        }
    }catch(err){
        console.error("Error occurred:", err);
        res.status(500).json({ message: "Internal Server Error", error: err });
    }
});

export default router;