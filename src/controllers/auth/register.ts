

import config from "@/config";

import User from '@/models/user'
import Token from '@/models/token';


import type { Request, Response } from "express";
import type { Iuser } from "@/models/user";
import { genUserName, hashPassword } from "@/utils";
import {hashRefreshToken} from '@/utils/hashToken'
import { generateAccessToken,generateRefreshToken } from "@/lib/jwt";

type UserData = Pick<Iuser, 'email' | 'password' | 'role'>;

const register = async(req:Request, res:Response) : Promise<void> =>{

    try {

        const {email, password, role} = req.body as UserData;

        if(role === 'admin'){

            const iswhitelisted = config.WHITELIST_EMAIL_LIST.includes(email)
            
            if(!iswhitelisted){
                res.status(403).json({
                code:"authorization error",
                message:"You can't register as admin"
            })
                return;
            }
        };

        const userName = genUserName();
        const hashpassword = await hashPassword(password);

        const newUser = await User.create({
            userName,
            email,
            password: hashpassword,
            role
        })

        const accessToken = await generateAccessToken(newUser._id);
        const refreshToken = await generateRefreshToken(newUser._id);


        const hashToken = hashRefreshToken(refreshToken);


        await Token.create({
            refreshToken: hashToken,
            userId: newUser._id
        })


        res.cookie('refreshToken',refreshToken,{
            httpOnly: true,
            secure: config.NODE_ENV === 'production',
            sameSite:'strict'
        })

        res.status(201).json({
           user:{
            userName : newUser.userName,
            email: newUser.email,
            role: newUser.role,
           },
           accessToken
        })
    } catch (err) {
        
        console.error("Registration error:", err);

        res.status(500).json({
            code:"Server Error",
            message:"Internal server error"
        })
    }
}




export default register;