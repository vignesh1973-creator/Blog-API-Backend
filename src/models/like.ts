

import { Schema, model, Types } from "mongoose";

interface ILike {
    blogId?: Types.ObjectId,
    userId: Types.ObjectId,
    commentId?: Types.ObjectId
}


const LikeSchema = new Schema<ILike>({
    blogId:{
        type: Schema.Types.ObjectId,
        ref:'Blog'
    },
    commentId:{
        type: Schema.Types.ObjectId,
        ref:'Comment'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
},{
    timestamps:true
});

LikeSchema.index({blogId:1, userId: 1},
        { 
            unique:true,
            partialFilterExpression:{
                blogId: {$type: "objectId"}
            }
        }
)


LikeSchema.index({commentId: 1,userId:1},{
        unique:true,
        partialFilterExpression:{
            commentId:{$type: "objectId"}
        }
}

)


export default model<ILike>('Like',LikeSchema);