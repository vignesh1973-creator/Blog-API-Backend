
import User from '@/models/user';
import Blog from '@/models/blog';

import config from '@/config';

import type { Request, Response } from 'express';


interface QueryType{
    status?: 'draft' | 'published'
}


const getAllBlogs = async(req:Request,res:Response):Promise<void> =>{
    try {
        const userId = req.userId;
        
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;

        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;

        const user = await User.findById(userId).select('role').lean().exec();


        if(!user){
            res.status(404).json({
                code:"UNAUTHORIZED",
                message:"User not found"
            })
            return
        }

        const query: QueryType = {}



        if(user.role === 'user'){
            query.status = 'published'
        }

     


        const [totalDocuments, blogs] = await Promise.all([

            Blog.countDocuments(query).exec(),

             Blog.find(query)
                                .select('-banner.publicId -__v')
                                .populate({
                                    path: 'author',
                                    select: "userName  firstName lastName socialLinks"
                                })
                                .skip(offset)
                                .sort({createdAt: -1})
                                .limit(limit)
                                .lean()
                                .exec()


        ])


        res.status(200).json({
            totalDocuments,
            limit,
            offset,
            blogs
        })
    } catch (err) {

        console.log("error fetching blogs", err)

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while fetching all published blogs"
        })
    }
}


export default getAllBlogs;
