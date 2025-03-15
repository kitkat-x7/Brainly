import { Service_Layer_Error } from "../../Error handling/error";
import { Find_Content_by_type } from "./data_access"

export const get_data_by_type=async (useremail:string,type:string)=>{
    try{
        const Data=await Find_Content_by_type(useremail,type);
        return Data;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
};