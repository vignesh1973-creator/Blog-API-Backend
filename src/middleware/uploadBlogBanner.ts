


import Blog from '@/models/blog';

import type {Request, Response, NextFunction} from 'express';


import uploadToCloudinary from '@/lib/cloudinary';

const MAX_FILE_SIZE = 2*1024*1024;


const uploadBlogBanner = (method: 'post'| 'put') =>{
    return async(req:Request, res:Response, next:NextFunction) =>{
        if(method === 'put' && !req.file ){
            next();
            return;
        }

        if(!req.file){
            res.status(400).json({
                code:"VALIDATION_ERROR",
                message:"Blog Banner is required"
            })

            return
        }


        if(req.file.size > MAX_FILE_SIZE){
            res.status(413).json({
                code:"VALIDATION_ERROR",
                message:"Banner size should be less than 2mb"
            })
            return
        }

        try {

            const {blogId} = req.params;
            const blog = await Blog.findById(blogId).select('banner.publicId').exec()

            if (method === "put" && !blog) {
            res.status(404).json({
                code: "BLOG_NOT_FOUND",
                message: "Blog not found"
            });
            return;
        }

            const data = await uploadToCloudinary(
                req.file.buffer,
                blog?.banner.publicId.replace('blog-api/','')
            )



            if(!data){
                res.status(500).json({
                    code:"SERVER_ERROR",
                    message:"Internal server error"
                })

                console.log("banner uploading error", {
                    blogId,
                    publicId: blog?.banner.publicId
                });
                return
            };

            const newBanner = {
                publicId : data.public_id,
                url: data.secure_url,
                width: data.width,
                height: data.height
            }

            req.body.banner = newBanner;

            next()
            
        } catch (err: any) {

            console.error("Cloudinary upload failed:", err);

            res.status(err.http_code || 500).json({
                code: "CLOUDINARY_UPLOAD_ERROR",
                message: "Unable to upload blog banner"
            });
        }
    }
}



export default uploadBlogBanner;