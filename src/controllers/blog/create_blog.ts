


import  DOMPurify  from 'dompurify';
import { JSDOM } from 'jsdom';


import Blog from '@/models/blog';

import type {Request, Response} from 'express';
import type { IBlog } from '@/models/blog';


const window = new JSDOM('').window;
const purify = DOMPurify(window)


type BlogData = Pick<IBlog,'title'| 'content'| 'banner' | 'status'>
 
const createBlog = async(req:Request,res:Response):Promise<void> =>{

    try{

        const {title, content, banner, status} = req.body as BlogData;
        
        const userId = req.userId;

        const sanitizedContent = purify.sanitize(content);

        const newBlog = await Blog.create({
            title,
            content:sanitizedContent,
            banner,
            status,
            author:userId
        });


        res.status(201).json({
            Blog: newBlog,
            message:"Blog created successfully"
    
        })

    }
    catch(err){

        console.log("Error during creating blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while creating the blog"
        })
    }
}


export default createBlog;