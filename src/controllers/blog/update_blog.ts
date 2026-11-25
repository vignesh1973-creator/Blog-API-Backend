


import  DOMPurify  from 'dompurify';
import { JSDOM } from 'jsdom';


import Blog from '@/models/blog';
import User from '@/models/user';

import type {Request, Response} from 'express';
import type { IBlog } from '@/models/blog';


const window = new JSDOM('').window;
const purify = DOMPurify(window)


type BlogData = Partial<Pick<IBlog,'title'| 'content'| 'banner' | 'status'>>
 
const updateBlog = async(req:Request,res:Response):Promise<void> =>{

    try{

        const {title, content, banner, status} = req.body as BlogData;
        
        const userId = req.userId;
        const blogId = req.params.blogId;


        const user = await User.findById(userId).select('role').lean().exec();

        const blog = await Blog.findById(blogId).select('-__v').exec();

        if(!blog){
            res.status(404).json({
                code:"NotFound",
                message:"Blog not found"
            })
            return
        };

        if(blog.author.toString() !== userId && user?.role !== 'admin'){
            res.status(403).json({
                code:"Authorization_Error",
                message:"Access denied, insufficient permissions"
            })
            return;
        }
       


            if (title !== undefined) {
            blog.title = title;
        }

        if (content !== undefined) {
            blog.content = purify.sanitize(content);
        }

        if (status !== undefined) {
            blog.status = status;
        }

        if (banner !== undefined) {
            blog.banner = banner;
        }


        await blog.save();

        res.status(200).json({
            blog,
            message:"Blog Updated successfully"
        })
    
       
        

    }
    catch(err){

        console.log("Error during updating blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while updating the blog"
        })
    }
}


export default updateBlog;