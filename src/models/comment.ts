




import { Schema, model, Types } from "mongoose";

export interface IComment {
    blogId: Types.ObjectId,
    userId: Types.ObjectId,
    content: string
}


const CommentSchema = new Schema<IComment>({
    blogId:{
        type: Schema.Types.ObjectId,
        ref:'Blog'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content:{
        type:String,
        required:true,
        maxLength: [1000,"content must be less than 1000 characters"]
    }
},{
    timestamps:true
});



CommentSchema.index({blogId: 1, createdAt: -1});


export default model<IComment>('Comment',CommentSchema);