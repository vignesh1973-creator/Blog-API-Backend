

import {Router} from 'express';


import authenticate from '@/middleware/authenticate';
import authorize from '@/middleware/authorize';
import validationError from '@/middleware/validationError';

import uploadBlogBanner from '@/middleware/uploadBlogBanner';

import multer from 'multer';


import {body,param,query} from 'express-validator';


import createBlog from '@/controllers/blog/create_blog';
import getAllBlogs from '@/controllers/blog/get_all_blog';
import getBlogsByUsers from '@/controllers/blog/get_blogs_by_users';
import getBlogsBySlug from '@/controllers/blog/get_Blogs_by_slug';
import updateBlog from '@/controllers/blog/update_blog';
import deleteBlogs  from '@/controllers/blog/delete_blog';


const router = Router();
const upload = multer();


router.post("/",
    authenticate,
    authorize(['admin']),

    upload.single('banner_image'),

    body('title')
    .trim()
    .notEmpty()
    .withMessage("Title shouldn't be empty")
    .isLength({max:100})
    .withMessage("Title should not be more than 100 characters"),

    body('content').trim().notEmpty().withMessage("Content is required"),

    body('status')
    .optional()
    .isIn(['draft','published'])
    .withMessage("Status should either be draft or published"),

    validationError,

    
    uploadBlogBanner('post'),

    createBlog
)



router.get("/",
         authenticate,
         authorize(['admin','user']),
         getAllBlogs

)

router.get("/user/:userId",
            authenticate,
            authorize(['admin','user']),
            param('userId').isMongoId().withMessage("Invalid userId "),
            validationError,
            getBlogsByUsers
)

router.get("/:slug",
            authenticate,
            authorize(['admin','user']),
            param('slug').notEmpty().withMessage("slug is required"),
            validationError,
            getBlogsBySlug
)


router.patch("/:blogId",
                authenticate,
                authorize(['admin']),
                upload.single('banner_image'),

                param('blogId').isMongoId().withMessage("Invalid blog Id"),

                body('title')
                .optional()
                .trim()
                .isLength({max:100})
                .withMessage("Title should not be more than 100 characters"),

                body("content")
                .optional()
                .isString()
                .withMessage("Content must be a string")
                .trim()
                .notEmpty()
                .withMessage("Content cannot be empty"),

                body('status')
                .optional()
                .isIn(['draft','published'])
                .withMessage("Status should either be draft or published"),


                validationError,

                uploadBlogBanner('put'),

                updateBlog

)


router.delete("/:blogId",
                authenticate,
                authorize(['admin']),
                param("blogId")
                .notEmpty()
                .withMessage("Blog ID is required")
                .isMongoId()
                .withMessage("Invalid blog ID"),
            validationError,
                deleteBlogs
)

export default router;