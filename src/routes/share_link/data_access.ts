import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { Database_Layer_Error } from "../../Error handling/error";

export const Share_Data=async (email:string)=>{
    try{
        await client.user.update({
            where:{
                email,
            },
            data:{
                share:true
            }
        });
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const getdata=async (email:string)=>{
    try{
        const Data=await client.user.findUnique({
            where:{
                email
            },
            select:{
                hashed_email:true,
                status:true,
                share:true,
            }
        });
        if(!Data || !Data.status || !Data.share){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return Data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}
