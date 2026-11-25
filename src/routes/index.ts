

import { Router } from "express";

import authRoutes from '@/routes/auth';
import userRoutes from '@/routes/user';
import blogRoutes from '@/routes/blog';
import likeRoutes from '@/routes/like';
import commentRoutes from '@/routes/comment';

const router = Router();



router.get("/",(req,res)=>{
    res.status(200).json({
        message: "Server is live",
        status:"OK",
        version:"1.0.0",
        timestamp: new Date().toISOString()
    })
});


router.use("/auth",authRoutes);
router.use("/users",userRoutes);
router.use('/blogs',blogRoutes);
router.use('/likes',likeRoutes);
router.use('/comments',commentRoutes)


export default router;