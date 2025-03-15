import { PrismaClient } from "@prisma/client";
const client=new PrismaClient();
import { ContentModel } from "../../Vector_DB/Content_DB";
import { Database_Layer_Error } from "../../Error handling/error";


interface Content_Data{
    id:number;
    useremail:string;
    title:string;
    link:string;
    description:string;
}

interface Create_Content_Data{
    email:string;
    title:string;
    type:string
    link:string;
    description:string;
}

export const getuser=async (email:string)=>{
    try{
        const Data=await client.user.findUnique({
            where:{
                email
            }
        });
        if(!Data || !Data.status){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return Data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",500);
    }
}

export const Create_Content=async (Data:Create_Content_Data):Promise<Content_Data>=>{
    try{
        const data=await client.content.create({
            data:{
                useremail:Data.email,
                title:Data.title,
                type:Data.type,
                link:Data.link,
                description:Data.description
            }
        });
        return data;
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}   

export const Find_Content=async (useremail:string,id:number):Promise<Content_Data>=>{
    try{
        const Data=await client.content.findUnique({
            where:{
                useremail,
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

export const Find_All_Content=async (useremail:string):Promise<Content_Data[]>=>{
    try{
        const Data=await client.content.findMany({
            where:{
                useremail,
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

export const Update_Content=async (Data:Content_Data)=>{
    try{
        const data=await client.content.update({
            where:{
                useremail:Data.useremail,
                id:Data.id
            },
            data:{
                title:Data.title,
                link:Data.link,
                description:Data.description
            }
        });
        if(!data){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}   

export const Delete_Content=async (id:number,useremail:string)=>{
    try{
        const data=await client.content.delete({
            where:{
                id,
                useremail
            }
        });
        if(!data){
            throw new Database_Layer_Error("Data Not Found",404);
        }else{
            return data
        }
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
};

export const Create_Vector_Content=async (id:number,title:string)=>{
    try{
        await ContentModel.create({
            content_id:id,
            title
        });
        return
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}
export const Update_Vector_Content=async (id:number,title:string)=>{
    try{
        await ContentModel.updateOne({content_id:id},{
            title
        });
        return
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}

export const Create_Tag=async (tag:string)=>{
    try{
        const tag_data=await client.tag.create({
            data:{
                tag
            }
        });
        return tag_data
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}

export const Create_Tag_Content_relation=async (contentid:number,tagname:string)=>{
    try{
        const tag_data=await client.contentandtag.create({
            data:{
                contentid,
                tagname
            }
        });
        return tag_data
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}

export const Find_Tag=async (tag:string)=>{
    try{
        const tag_data=await client.tag.findUnique({
            where:{
                tag
            }
        });
        return tag_data
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}

export const Find_All_Tag=async (contentid:number)=>{
    try{
        const tag_data=await client.contentandtag.findMany({
            where:{
                contentid
            }
        });
        return tag_data
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}



export const Delete_Tag=async (contentid:number,tagname:string)=>{
    try{
        const tag_data=await client.contentandtag.delete({
            where:{
                contenttagid:{
                    contentid:contentid,
                    tagname:tagname,
                }
            }
        });
        return tag_data;
    }catch(err){
        console.error("Database error:", err);
        throw new Database_Layer_Error("Database Error",404);
    }
}