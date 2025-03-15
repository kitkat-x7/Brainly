import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { Database_Layer_Error } from "../../Error handling/error";

interface Content_Data{
    id:number;
    useremail:string;
    title:string;
    link:string;
    description:string;
}
export const Find_Content=async (id:number):Promise<Content_Data>=>{
    try{
        const Data=await client.content.findUnique({
            where:{
                id
            }
        });
        if(!Data){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return Data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
} 