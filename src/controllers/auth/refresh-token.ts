

import Token from '@/models/token';

import type { Request, Response } from "express";

import {generateAccessToken,generateRefreshToken,verifyRefreshToken} from '@/lib/jwt';

import {hashRefreshToken} from '@/utils/hashToken'

import  {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';

import config from '@/config'



const refreshToken = async(req:Request,res:Response): Promise<void> =>{
    const oldrefreshToken = req.cookies.refreshToken as string;

    try{

        const jwtPayload = await verifyRefreshToken(oldrefreshToken);

        if (typeof jwtPayload === 'string' || !jwtPayload.userId) {
            res.status(401).json({
                code: "AUTHORIZATION_ERROR",
                message: "Invalid refresh token"
            });
            return;
        }

        const oldTokenHash = hashRefreshToken(oldrefreshToken);

        const newAccessToken = await generateAccessToken(jwtPayload.userId);
        const newRefreshToken = await generateRefreshToken(jwtPayload.userId);

        const newTokenHash = hashRefreshToken(newRefreshToken);


        const updatedToken = await Token.findOneAndUpdate({
            refreshToken:oldTokenHash,
            userId:jwtPayload.userId
        },{
            $set:{
                refreshToken: newTokenHash
            }
        },
            {
                new:true

            }    
    )

    if(!updatedToken){
        res.status(401).json({
            code:"AUTHORIZATION_ERROR",
            message:"Invalid or already used refresh token"
        })
    }


    res.cookie('refreshToken',newRefreshToken,{
        httpOnly:true,
        sameSite:'strict',
        secure: config.NODE_ENV === 'production'
    })

        res.status(200).json({
            code:"SUCCESS",
            message:"Access token generated successfully",
            accessToken: newAccessToken
        })
        

        

    }
    catch(err){

        if(err instanceof TokenExpiredError){
            res.status(401).json({
                code:"AUTHORIZATION_ERROR",
                message:"Refresh token has expired"
            });
            return;
        }

        if(err instanceof JsonWebTokenError){
            res.status(401).json({
                code:"AUTHORIZATION_ERROR",
                message:"Invalid refresh token"
            });
            return;
        }   

        res.status(500).json({
            code:"server error",
            message:"Internal server Error"
        })
    }
}



export default refreshToken;