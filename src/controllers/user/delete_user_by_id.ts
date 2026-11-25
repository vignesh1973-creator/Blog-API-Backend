

import User from '@/models/user';
import Blog from '@/models/blog';
import Token from '@/models/token';

import {v2 as cloudinary} from 'cloudinary';


import type {Request, Response} from 'express';


const deleteUserById  = async(req:Request, res:Response):Promise<void> =>{

    try{
        const userId = req.params.userId;

        const user = await User.findById(userId);

        if(!user){
            res.status(404).json({
                code:"USER_NOT_FOUND",  
                message:"User not found"
            });
            return;
        }

        const blogs = await Blog.find({author: userId}).select('banner.publicId').lean().exec();
        
                const publicIds = blogs.map(({banner})=>banner.publicId);
        
                if (publicIds.length > 0) {
                    await cloudinary.api.delete_resources(publicIds);
                }        
        
                await Blog.deleteMany({author: userId})
        
                await Token.deleteMany({ userId }).exec();
                
                await User.deleteOne({_id:userId}).exec();

                
        
        
                res.sendStatus(204);


        
    }
    catch(err){
        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while fetching the user"
        })
    }
}

export default deleteUserById;