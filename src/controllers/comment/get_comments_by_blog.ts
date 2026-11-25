




import Blog from '@/models/blog';
import Comment from '@/models/comment';




import type { Request, Response } from 'express';





const getCommentsByBlog = async(req:Request, res:Response):Promise<void> =>{


    const blogId = req.params.blogId;

   
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

        const page = Math.max(1, Number(req.query.page) || 1);

        const limit = Math.min(
            100,
            Math.max(1, Number(req.query.limit) || 10)
        );

        const offset = (page -1) * limit;


        const[comments, totalComments] = await Promise.all([
            Comment.find({blogId})
                    .sort({createdAt: -1,_id:-1})
                    .skip(offset)
                    .limit(limit)
                    .populate("userId","userName firstName lastName")
                    .select("-__v")
                    .lean()
                    .exec(),

            Comment.countDocuments({blogId})
        ]);



        res.status(200).json({
            comments,
            pagination:{
                page,
                limit,
                totalComments,
                totalPages: Math.ceil(totalComments/limit)
            }
        });
     
    } catch (err: any) {


            
        console.log("Error during reteriving comment of a blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while reteriving  comment of a blog"
        })
    }
}


export default getCommentsByBlog;    