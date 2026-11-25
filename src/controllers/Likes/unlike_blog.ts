

import Blog from '@/models/blog';
import Like from '@/models/like';

import { Types } from "mongoose";


import { Request, Response } from 'express';


const unLikeBlog = async(req:Request, res:Response):Promise<void> =>{
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

       const existingLike = await Like.findOneAndDelete({blogId,userId});

       if(!existingLike){
        res.status(404).json({
            code:"Not_FOUND",
            message:"User didnt like the blog"
        })
        return;
       }

         const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $inc:{likesCount : -1}
            },
            {
                new:true
            }
         ).select("likesCount").lean().exec()
       
         if(!updateBlog){
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


        

            
        console.log("Error during unliking a blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while unliking a blog"
        })
    }
}


export default unLikeBlog;    