

import { Router } from "express";

import { body, cookie } from "express-validator";

import validationError from "@/middleware/validationError";
import authenticate from '@/middleware/authenticate'

import registerUser from '@/controllers/auth/register'
import loginUser from '@/controllers/auth/login';
import refreshToken from '@/controllers/auth/refresh-token';
import logoutUser from '@/controllers/auth/logout';


import User from '@/models/user';


const router = Router();



router.post("/register",
    body('email')
    .trim()
    .toLowerCase()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .isLength({max:50})
    .withMessage("Not length more than 50 characters")
    .isEmail()
    .withMessage("Email should be in correct format")
    .custom(async(value)=>{
        const userExists = await User.exists({email:value})

        if(userExists){
            throw new Error("User already exists")
        }
    }),

    body('password')
    .notEmpty()
    .withMessage("Password shouldn't be empty")
    .isLength({min:5})
    .withMessage("Password should be atleast 5 characters"),

    body("role")
    .optional()
    .isString()
    .withMessage("Role must be of string")
    .isIn(['admin','user'])
    .withMessage("Role must be either admin or user"),

    validationError
    ,registerUser)


router.post("/login",
    body('email')
    .trim()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email is required")
    .bail()  //this stop from executing the next validation if the  previous one fails
    .isLength({max:50})
    .withMessage("Not length more than 50 characters")
    .bail()
    .isEmail()
    .withMessage("Email should be in correct format")
    .bail(),

   
    body('password')
    .notEmpty()
    .withMessage("Password shouldn't be empty")
    .bail(),
    validationError,
    loginUser)


router.post("/refresh-token",
    cookie('refreshToken')
    .notEmpty()
    .withMessage("Refresh token is required")
    .bail()
    .isJWT()
    .withMessage("Refresh Token is not valid"),
    validationError,
    refreshToken)


router.post("/logout",authenticate,logoutUser)

export default router;