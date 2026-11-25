
import { Router } from "express";

import { body,param,query } from "express-validator";

import authenticate from "@/middleware/authenticate";
import authorize from "@/middleware/authorize";
import validationError from "@/middleware/validationError";


import commentBlog from "@/controllers/comment/comment_blog";
import getCommentsByBlog from "@/controllers/comment/get_comments_by_blog";
import deleteComment from "@/controllers/comment/delete_comment";


const router = Router();


router.post('/blog/:blogId',
            authenticate,
            authorize(["admin","user"]),
            param('blogId').isMongoId().withMessage("Invalid mongo Id"),
            body('content')
            .trim()
            .notEmpty()
            .withMessage("Content is required")
            .isLength({max:1000})
            .withMessage("Content must be less 1000 characters"),
            validationError,
            commentBlog
)




router.get('/blog/:blogId',
            authenticate,
            authorize(["admin","user"]),

            param('blogId').isMongoId().withMessage("Invalid mongo Id"),

            validationError,

            getCommentsByBlog
)

router.delete("/:commentId",
                authenticate,
                authorize(['admin','user']),
                param('commentId').isMongoId().withMessage("Invalid mongo Id"),
                validationError,
                deleteComment


)

export default router;