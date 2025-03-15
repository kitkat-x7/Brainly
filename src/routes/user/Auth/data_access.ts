import { PrismaClient } from "@prisma/client";
import { Database_Layer_Error } from "../../../Error handling/error";
const client=new PrismaClient();

interface Register_data{
    email:string,
    password:string,
    hashed_email:string,
    name:string,
    phone_number:string
}
export const getdata=async (email:string)=>{
    try{
        const data=await client.user.findUnique({
            where:{
                email
            }
        });
        console.log(data);
        return data;
    }catch (err) {
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}

export const postdata=async (data:Register_data)=>{
    try{
        const Data=await client.user.create({
            data:{
                email:data.email,
                password:data.password,
                hashed_email:data.hashed_email,
                name:data.name,
                phone_number:data.phone_number
            }
        });
        console.log(Data);
        return;
    }catch (err) {
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}