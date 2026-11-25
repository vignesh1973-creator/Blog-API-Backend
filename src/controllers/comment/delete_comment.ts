





import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';




import type { Request, Response } from 'express';





const deleteComment = async(req:Request, res:Response):Promise<void> =>{


        const commentId = req.params.commentId;
        const userId = req.userId;
   
    try {

        const comment = await Comment.findById(commentId).select('blogId userId').lean().exec();

        const user = await User.findById(userId).select('role').lean();


        if(!comment){
            res.status(404).json({
                code:"NOT_FOUND",
                message:"Comment not found"
            })
            return;
        }

        if(comment.userId.toString() !== userId && user?.role !=='admin'){
            res.status(403).json({
                code:"AUTHORIZATION_ERROR",
                message:"A user cant delete another user's comment"
            })
            return;
        }

        /**
         * 
           * If the comment belongs to the logged-in user → allow deletion.

           * If the comment belongs to someone else, but the logged-in user is an admin → allow deletion.

           * If the comment belongs to someone else and the logged-in user isn't an admin → deny deletion.

         */
        
        
        await Comment.deleteOne({_id: commentId});

        const updateBlog = await Blog.findByIdAndUpdate(
            comment.blogId,
            {
                $inc: {commentsCount: -1}
            },
            {
                new: true
            }
        ).select("commentsCount").lean().exec()


        if(!updateBlog){
                    res.status(404).json({
                        code:"NOT_FOUND",
                        message:"Blog not found"
                    })
                    return;
                }
                
      



        res.sendStatus(204);

    } catch (err: any) {


            
        console.log("Error during deleting comment of a blog",err);
        

        res.status(500).json({
            code:"INTERNAL_SERVER_ERROR",
            message:"An error occurred while deleting  comment of a blog"
        })
    }
}


export default deleteComment;    