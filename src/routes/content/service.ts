import { Create_Tag, Create_Tag_Content_relation, Create_Vector_Content, Delete_Content, Delete_Tag, Find_All_Content, Find_All_Tag, Find_Content, Find_Tag, getuser, Update_Vector_Content } from "./data_access";
import { Create_Content,Update_Content } from "./data_access";
import { create_embeddings, update_embeddings } from "../../controllers/AI_embeddings";
import { Service_Layer_Error } from "../../Error handling/error";
import bcrypt from 'bcrypt';
interface Create_Content_Data{
    email:string;
    title:string;
    link:string;
    description:string;
    tags:string[];
}

interface Update_Content_Data{
    id:number;
    email:string;
    title:string;
    link:string;
    description:string;
    tags:string[];
}
export const Create_Content_Data=async (Data:Create_Content_Data)=>{
    try{
        const types=["yout","x.com","facebook","instagram","reddit","drive"];
        let search_data="other",index_data=1000,D;
        for(let index of types){
            D=Data.link.search(index);
            if(D!=-1){
                if(index_data>D){
                    index_data=D;
                    search_data=index;
                }
            }
        }
        const content_data={
            email:Data.email,
            title:Data.title,
            type:search_data,
            link:Data.link,
            description:Data.description,
            tags:Data.tags
        }
        const data=await Create_Content(content_data);
        await Create_Vector_Content(data.id,data.title);
        console.log(await create_embeddings(data.id,data.title));
        for(let tag of Data.tags){
            const data_tag=await Find_Tag(tag);
            if(data_tag){
                await Create_Tag_Content_relation(data.id,tag);
            }else{
                const created_tag=await Create_Tag(tag);
                await Create_Tag_Content_relation(data.id,created_tag.tag);
            }
        }
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const Update_Content_Data=async (Data:Update_Content_Data)=>{
    try{
        const data={
            id:Data.id,
            useremail:Data.email,
            title:Data.title,
            link:Data.link,
            description:Data.description,
            tags:Data.tags
        }
        await Update_Content(data);
        await Update_Vector_Content(data.id,data.title);
        console.log(await update_embeddings(data.id,data.title));
        const previous_tags=await Find_All_Tag(Data.id);
        for(let index in previous_tags){
            if(!Data.tags.includes(previous_tags[index].tagname)){
                await Delete_Tag(Data.id,previous_tags[index].tagname);
            }
        }
        for(let index in Data.tags){
            if(!previous_tags.some(obj=>{
                obj.tagname===Data.tags[index];
            })){
                await Create_Tag_Content_relation(Data.id,Data.tags[index]);
            }
        }
        for(let tag of Data.tags){
            const data_tag=await Find_Tag(tag);
            if(data_tag){
                await Create_Tag_Content_relation(data.id,tag);
            }else{
                const created_tag=await Create_Tag(tag);
                await Create_Tag_Content_relation(data.id,created_tag.tag);
            }
        }
        return;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const Delete_Content_Data=async (id:number,useremail:string)=>{
    try{
        await Delete_Content(id,useremail);
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const Get_Content=async (hashedemail:string,email:string,email_user:string)=>{
    try{
        const verify_own=await bcrypt.compare(email_user,hashedemail);
        const verify_other=await bcrypt.compare(email,hashedemail);
        const user=await getuser(email);
        if(verify_own || (verify_other && user.share)){
            const data=await Find_All_Content(email);
            return data;
        }else{
            throw new Service_Layer_Error("Brain is Private",401);
        }
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
    
}

export const Get_Content_Specific=async (hashedemail:string,email:string,email_user:string,id:number)=>{
    try{
        const verify_own=await bcrypt.compare(email_user,hashedemail);
        const verify_other=await bcrypt.compare(email,hashedemail);
        const user=await getuser(email);
        if(verify_own || (verify_other && user.share)){
            const data=await Find_Content(email,id);
            return data;
        }else{
            throw new Service_Layer_Error("Brain is Private",401);
        }
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
    
}