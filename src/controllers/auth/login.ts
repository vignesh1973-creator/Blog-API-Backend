

import { generateAccessToken,generateRefreshToken } from "@/lib/jwt";
import {comparePassword} from '@/utils';

import User from '@/models/user';
import Token from '@/models/token';

import config from "@/config";

import {hashRefreshToken} from '@/utils/hashToken'

import type { Request,Response } from "express";
import type { Iuser } from "@/models/user";

type UserData = Pick<Iuser, 'email' | 'password'>;

const login = async(req:Request,res:Response):Promise<void> =>{
    try {
        const {email,password} = req.body as UserData;

        const user = await User.findOne({email})
                                .select("+password")
                                .lean()
                                .exec();

                  

        if(!user || !user.password){
            res.status(401)
            .json({
               code:"INVALID_CREDENTIALS",
               message:"Invalid email or password"
            })
            return;
        }


        const isMatch = await comparePassword(password, user.password);

            if (!isMatch) {
                res.status(401).json({
                    code: "INVALID_CREDENTIAL",
                    message: "Invalid email or password"
                });
                return;
            }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const hashToken = hashRefreshToken(refreshToken);

        await Token.create({
            refreshToken: hashToken,
            userId:user._id
        })

        res.cookie("refreshToken",refreshToken,{
            httpOnly:true,
            secure: config.NODE_ENV === 'production',
            sameSite:true
        });


        res.status(201).json({
            user:{
                userName: user.userName,
                email:user.email,
                role:user.role
            },
            message:"User Logged in Successfully",

            accessToken
        })




    } catch (error) {
        
        console.log("Login error",error);

        res.status(500).json({
            code:"Server error",
            message:"Internal server error"
        })
    }
}



export default login;