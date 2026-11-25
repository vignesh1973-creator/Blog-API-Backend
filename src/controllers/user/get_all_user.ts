
import User from '@/models/user';
import config from '@/config';

import type {Request, Response} from 'express';


const getAllUser = async(req:Request,res:Response):Promise<void> =>{

    try{
        const limit = parseInt(req.query.limit as string) || config.defaultResLimit;
        const offset = parseInt(req.query.offset as string) || config.defaultResOffset;

        const totalDocuments = await User.countDocuments().exec();


        //offset = (page - 1) × limit  --- offset based pagination formula
        //limit=10&cursor_id =    ---- cursor based pagination formula 


        const users = await User.find()
                                .select('-__v')
                                .skip(offset)
                                .limit(limit)
                                .lean()
                                .exec();


        res.status(200).json({
            totalDocuments,
            limit,
            offset,
            users
        });


    }
    catch(err){
        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while fetching all users"
        })
    }
}


export default getAllUser;