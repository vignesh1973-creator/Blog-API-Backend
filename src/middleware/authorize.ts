
import {Request, Response, NextFunction} from 'express';


import User from '@/models/user';



export type Authrole = 'admin' | 'user';

const authorize = (roles:Authrole[])=>{
    return async(req:Request, res:Response, next:NextFunction)=>{
        const userId = req.userId;

        try{
            const user = await User.findById(userId)
                                    .select('role')
                                    .lean()
                                    .exec();

            if(!user){
                res.status(401).json({
                    code:"UNAUTHORIZED",
                    message:"User not found"
                })
                return;
            }

            if(!roles.includes(user.role)){
                res.status(403).json({
                    code:"FORBIDDEN",
                    message:"you dont have permission to access this resource"
                })
                return;
            }

            return next();
        }
        catch(err){
            res.status(500).json({
                code:"INTERNAL_SERVER_ERROR",
                message:"An error occurred while processing your request"
            })
        }

     }
}


export default authorize;
