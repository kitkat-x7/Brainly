import mongoose,{Schema} from "mongoose"

interface Content{
    content_id:number,
    title:string,
}
const content=new Schema<Content>({
    content_id:{
        type:Number,
        required:true
    },
    title:{
        type:String,
        required:true
    }
});

export const ContentModel = mongoose.model<Content>("content_embeddings", content);

