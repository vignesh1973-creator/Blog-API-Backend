
import User from '@/models/user';

import type {Request, Response} from 'express';


const getUserById = async(req:Request, res:Response):Promise<void> =>{

    try{
        const userId = req.params.userId;
        const user = await User.findById(userId).select('-password -__v').lean().exec();

        if(!user){
            res.status(404).json({
                code:"USER_NOT_FOUND",
                message:"User not found"
            });
            return;
        }

        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while fetching the user"
        })
    }
}


export default getUserById;