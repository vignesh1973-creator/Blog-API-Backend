
import User from '@/models/user';
import Blog from '@/models/blog';


import type { Request, Response } from 'express';





const getBlogsBySlug = async(req:Request,res:Response):Promise<void> =>{
    try {
        const slug = req.params.slug;

        const userId = req.userId;

        const user = await User.findById(userId).select('role').lean().exec();


        if(!user){
            res.status(404).json({
                code:"UNAUTHORIZED",
                message:"User not found"
            })
            return
        }
        
        const query = user.role === 'user'
                     ? {slug, status: "published" as const}
                     : {slug}


        const blog = await Blog.find(query)
                                .select('-banner.publicId -__v')
                                .populate({
                                    path: 'author',
                                    select: "userName  firstName lastName socialLinks"
                                })
                                .lean()
                                .exec()



        if(!blog){
            res.status(404).json({
                code:"UNAUTHORIZED",
                message:"Blog not found"
            })
            return
        }
     

    

        res.status(200).json({      
            blog
        })
    } catch (err) {

        console.log("error fetching blogs", err)

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while fetching all published blogs of a particular author"
        })
    }
}


export default getBlogsBySlug;
