

import { Router } from "express";

import { body,param,query } from "express-validator";

import authenicate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationError from "@/middleware/validationError";


import likeBlog from "@/controllers/Likes/like_blog";
import unLikeBlog from "@/controllers/Likes/unlike_blog";


const router = Router();



router.post("/blog/:blogId",
            authenicate,
            authorize(['admin','user']),
            param("blogId")
            .notEmpty()
            .withMessage("Blog ID is required")
            .isMongoId()
            .withMessage("Invalid blog ID"),

             validationError,
            likeBlog
)


router.delete("/blog/:blogId",
            authenicate,
            authorize(['admin','user']),
            param("blogId")
            .notEmpty()
            .withMessage("Blog ID is required")
            .isMongoId()
            .withMessage("Invalid blog ID"),

             validationError,
            unLikeBlog
)


export default router;