



import Blog from '@/models/blog';
import User from '@/models/user';

import type {Request, Response} from 'express';

import { v2 as cloudinary } from 'cloudinary';
 
const deleteBlogs = async(req:Request,res:Response):Promise<void> =>{

    try{

        const userId = req.userId;
        const blogId = req.params.blogId;

        const user = await User.findById(userId).select('role').lean().exec();

        const blog = await Blog.findById(blogId).select('author banner.publicId').lean().exec();

        if(!blog){
            res.status(404).json({
                code:"NOT_Found",
                message:"Blog not found"
            })
            return;
        }

        if(blog.author.toString() !== userId && user?.role !== 'admin'){
            res.status(403).json({
                code:"AUTHORIZATION_ERROR",
                message:"Access denied Insufficient permissions"
            })

            return;
        }
        
        await cloudinary.uploader.destroy(blog.banner.publicId);

        await Blog.deleteOne({_id: blogId});

        res.sendStatus(204);
        

    }
    catch(err){

        console.log("Error during deleting blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while deleting the blog"
        })
    }
}


export default deleteBlogs;