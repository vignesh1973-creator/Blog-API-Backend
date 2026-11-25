

import Blog from '@/models/blog';
import Like from '@/models/like';

import { Types } from "mongoose";


import { Request, Response } from 'express';


const likeBlog = async(req:Request, res:Response):Promise<void> =>{
    const blogId = req.params.blogId;
    const userId = req.userId;
    try {
        if (typeof blogId !== "string") {
        res.status(400).json({
            code: "INVALID_BLOG_ID",
            message: "Invalid blog ID"
        });
        return;
        }

        const blog = await Blog.findById(blogId).select('_id').lean().exec();

        if(!blog){
            res.status(404).json({
                code:"Not found",
                message:"Blog not found"
            });
            return;
        }

         await Like.create({
            blogId: new Types.ObjectId(blogId),
            userId: new Types.ObjectId(userId!)
         });


         const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $inc:{likesCount : 1}
            },
            {
                new:true
            }
         ).select("likesCount").lean().exec()
       
         if(!updateBlog){
            await Like.deleteOne({blogId,userId});
            res.status(404).json({
                code:"NOT_FOUND",
                message:"Blog not found"
            })
            return;
         }


        
        res.status(200).json({
            LikesCount: updateBlog.likesCount
        })
        
    } catch (err: any) {


        if(err.code === 11000){
            res.status(409).json({
                code:"ALREADY_LIKED",
                message:"You already liked this blog"
            })
            return;
        }

            
        console.log("Error during liking a blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while liking a blog"
        })
    }
}


export default likeBlog;    