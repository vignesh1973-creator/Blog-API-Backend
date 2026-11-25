
import { Schema,model,Types } from "mongoose";

import { genSlug } from "@/utils";


export interface IBlog{
    title:string,
    slug: string,
    content: string,
    banner:{
        publicId: string,
        url:string,
        width:number,
        height:number
    },
    author: Types.ObjectId,
    viewsCount: number,
    likesCount: number,
    commentsCount: number,
    status: 'draft' | 'published'
};


const blogSchema = new Schema<IBlog>({
    title:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:100,
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    content:{
        type:String,
        required:true,
    },
    banner:{
        publicId:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        },
        width:{
            type:Number,
            required:true
        },
        height:{
            type:Number,
            required:true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    viewsCount:{
        type:Number,
        default:0
    },
    likesCount:{
        type:Number,
        default:0
    },
    commentsCount:{
        type:Number,
        default:0
    },
    status:{
        type:String,
        enum:{
            values:['draft','published'],
            message:"Status must be either draft or published"
        },
        default:'draft'
    }
},{
    timestamps:true
});


blogSchema.pre('validate',function(){
    if(this.title && !this.slug){
        this.slug = genSlug(this.title)
    }
})

export default model<IBlog>('Blog',blogSchema);