import { AIquery } from "../../controllers/AI_Query";
import { Find_Content } from "./data_access";

export const Query_search=async (query:string)=>{
    console.log("Executing Python script...");
    const result = await AIquery(query);
    console.log("Executed Python script...");
    const result_obj = JSON.stringify(result);
    const result_data = JSON.parse(JSON.parse(result_obj));
    let data,final_result=[];
    for(let id in result_data){
        data=await Find_Content(result_data[id]);
        final_result.push(data);
    }
    return final_result;
}