


import  DOMPurify  from 'dompurify';
import { JSDOM } from 'jsdom';

import Blog from '@/models/blog';
import Comment from '@/models/comment';

import { Types } from 'mongoose';



import type { Request, Response } from 'express';
import type { IComment } from '@/models/comment';

type CommentData = Pick<IComment,'content'>;


const window = new JSDOM('').window;
const purify = DOMPurify(window);




const commentBlog = async(req:Request, res:Response):Promise<void> =>{

     const {content} = req.body as CommentData;
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
                code:"NOT_FOUND",
                message:"Message not found"
            })
            return;
        }

        const cleanContent = purify.sanitize(content).trim();

          if (!cleanContent) {
            res.status(400).json({
                code: "INVALID_CONTENT",
                message: "Comment cannot be empty"
            });
            return;
        }


        const newComment = await Comment.create({
            blogId:  new Types.ObjectId(blogId),
            userId:  new Types.ObjectId(userId),
            content: cleanContent
        });

   
        const updateBlog = await Blog.findByIdAndUpdate(
            blogId,
            {
                $inc: {commentsCount: 1}
            },
            {
                new: true
            }
        ).select('commentsCount').lean().exec()


        if(!updateBlog){
            await Comment.deleteOne({_id: newComment._id});
            res.status(404).json({
                code:"NOT_FOUND",
                message:"Blog not found"
            })
            return;
        }
        
        res.status(201).json({
            message:"comment added successfully",
            comment: newComment.content,
            commentsCount: updateBlog.commentsCount
        })
       
        
    } catch (err: any) {


            
        console.log("Error during commenting a blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while commenting a blog"
        })
    }
}


export default commentBlog;    