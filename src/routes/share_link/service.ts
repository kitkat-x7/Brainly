import { Service_Layer_Error } from "../../Error handling/error";
import { getdata, Share_Data } from "./data_access"

export const share_brain=async (email:string)=>{
    try{
        await Share_Data(email);
        const hashed_email=await getdata(email);
        const link=`http://localhost:3000/api/v2/user/content/${hashed_email.hashed_email}`;
        return link;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}