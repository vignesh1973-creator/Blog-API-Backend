

import User from '@/models/user';

import type {Request, Response} from 'express';



const updateCurrentUser = async(req:Request, res:Response): Promise<void> =>{

    const userId = req.userId;

    const {userName,firstName, lastName, website, Linkedin, youtube} = req.body;

    try {

        const user = await User.findById(userId).select('-__v').exec();

        if (!user) {
            res.status(404).json({
                code: "USER_NOT_FOUND",
                message: "User not found"
            });
            return;
        }

        if(userName !== undefined) user.userName = userName;
        if(firstName !== undefined) user.firstName = firstName;
        if(lastName !== undefined) user.lastName = lastName;
        if(!user.socialLinks) user.socialLinks = {};
        if(website !== undefined) user.socialLinks.website = website;
        if(Linkedin !== undefined) user.socialLinks.Linkedin = Linkedin;
        if(youtube !== undefined) user.socialLinks.youtube = youtube;

        await user.save();

        res.status(200).json({
            message: "User updated successfully",
            user
        });

    } catch (err) {

        console.log(err);
        
        res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "An error occurred while updating the current user"
        });
    }

}


export default updateCurrentUser