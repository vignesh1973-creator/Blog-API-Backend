

import type {Request, Response} from 'express';

import Token from '@/models/token';

import {hashRefreshToken} from '@/utils/hashToken'

import config from '@/config';



const logout = async(req:Request, res:Response): Promise<void> =>{
    try{
        const refreshToken = req.cookies?.refreshToken as string | undefined;

        if(refreshToken){
            const tokenHash = hashRefreshToken(refreshToken);

            await Token.deleteOne({refreshToken:tokenHash, userId:req.userId})
        }   

    

        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure: config.NODE_ENV === 'production',
            sameSite:'strict'
        })  

        res.sendStatus(204);
    }
    catch(err){
        console.log("Logout error",err);


        res.status(500).json({
            code:"SERVER_ERROR",
            message:"An error occured while logging out"
        })
    }
}



export default logout;