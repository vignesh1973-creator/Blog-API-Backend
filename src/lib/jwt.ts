

import jwt from 'jsonwebtoken';


import config from '@/config';

import { Types } from 'mongoose';



export const generateAccessToken = async(userId: Types.ObjectId | string) : Promise<string> =>{
    const secret = config.JWT_ACCESS_SECRET;
    if (!secret) {
        throw new Error('JWT_ACCESS_SECRET is not configured');
    }

    return jwt.sign({userId: userId.toString()},secret,{
        expiresIn:config.JWT_ACCESS_EXPIRY,
        subject:"accessAPI"
    })
}


export const generateRefreshToken = async(userId: Types.ObjectId | string) : Promise<string> =>{
    const secret = config.JWT_REFRESH_SECRET;
    if (!secret) {
        throw new Error('JWT_REFRESH_SECRET is not configured');
    }

    return jwt.sign({userId: userId.toString()},secret,{
        expiresIn:config.JWT_REFRESH_EXPIRY,
        subject:"refreshAPI"
    })
}



export const verifyAccessToken = async(token:string) => {
    const secret = config.JWT_ACCESS_SECRET;

    if(!secret){
        throw new Error('JWT_ACCESS_SECRET is not configured')
    }

    return jwt.verify(token, secret);
}


export const verifyRefreshToken = async(token:string)=>{
    const secret = config.JWT_REFRESH_SECRET;

    if(!secret){
        throw new Error('JWT_REFRESH_SECRET is not configured')
    }

    return jwt.verify(token, secret);
}
