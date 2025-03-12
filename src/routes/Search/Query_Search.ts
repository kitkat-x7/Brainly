import express,{Response,Request} from 'express';
import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { verifyuser } from "../../middleware/verifyuser";
const { spawn } = require('child_process');
import dotenv from 'dotenv'; 

const router=express.Router();
router.use(express.json());
router.use(verifyuser);


async function AIquery(query:string) {
    return new Promise<string>((resolve, reject) => {
        const python = spawn('python', ['path of query',query]);
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
                reject(`Process exited with code ${code} \n Error Output:\n${errorOutput}`);
            } else {
                resolve(output.trim());
            }
        });
    })
}
router.post("/",async (req:Request,res:Response)=>{
    const {query}=req.body;
    if(!query || typeof(query)!="string"){
        res.status(403).json({
            message:"Give a proper query",
        });
        return;
    }
    try {
        console.log("Executing Python script...");
        const result = await AIquery(query);
        console.log("Executed Python script...");
        const result_obj = JSON.stringify(result);
        const result_data = JSON.parse(JSON.parse(result_obj));
        let data,final_result=[];
        for(let id in result_data){
            data=await client.content.findFirst({
                where:{
                    id:result_data[id]
                }
            });
            final_result.push(data);
        }
        res.status(200).json(final_result);
        return;
    } catch (err) {
        console.error(`Error: ${err}`);
        res.status(500).send(err); 
    }
});

export default router;