import { deletedata, getdata } from "./data_access";
import { Service_Layer_Error } from "../../../Error handling/error";
import { patchdata } from "./data_access";
interface Updated_Data{
    email:string,
    name:string,
    phone_number:string
}
export const Get_Profile=async (email:string)=>{
    try{
        const data=await getdata(email);
        return data;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
};

export const Update_Profile=async (data:Updated_Data)=>{
    try{
        await patchdata(data);
        return;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}

export const Delete_Profile=async (email:string)=>{
    try{
        await deletedata(email);
        return;
    }catch(err){
        console.error("Service layer Error:", err);
        throw new Service_Layer_Error("Service layer Error",500);
    }
}