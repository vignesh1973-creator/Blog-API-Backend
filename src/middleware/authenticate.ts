
import {JsonWebTokenError, TokenExpiredError} from 'jsonwebtoken';
import {Request, Response,NextFunction} from 'express';
import {verifyAccessToken} from '@/lib/jwt';


const authenicate = async(req:Request, res:Response,next:NextFunction):Promise<void> =>{
    const authHeader = req.headers.authorization;

    if(!authHeader?.startsWith('Bearer ')){
        res.status(401).json({
            code:"AUTHORIZATION_ERROR",
            message:"Authorization header is missing or invalid"
        })
        return;
    }

    const token= authHeader.slice(7).trim();

    if(!token){
        res.status(401).json({
            code:"AUTHORIZATION_ERROR",
            message:"Access token is missing"
        })
        return;
    }

    try{

        const jwtPayload = await verifyAccessToken(token);

        if(typeof jwtPayload === 'string' || !jwtPayload.userId){
            res.status(401).json({
                code:"AUTHORIZATION_ERROR", 
                message:"Invalid access token"
            })
            return;
        }

        req.userId = jwtPayload.userId ;

        next();
    }
    catch(err){
        if(err instanceof TokenExpiredError){
            res.status(401).json({
                code:"AUTHORIZATION_ERROR",
                message:"Access token has expired"
            })
            return;
        }

        if(err instanceof JsonWebTokenError){
            res.status(401).json({
                code:"AUTHORIZATION_ERROR",
                message:"Invalid access token"
            })
            return;
        }

        res.status(500).json({
            code:"SERVER_ERROR",
            message:"An error occured while authenticating the user"
        })
    }
}


export default authenicate