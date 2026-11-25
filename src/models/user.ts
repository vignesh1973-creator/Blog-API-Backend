

import { Schema, model } from "mongoose";



export interface Iuser {
    userName: string,
    email:string,
    password: string,
    role: 'admin' | 'user',
    firstName?: string,
    lastName?: string,
    socialLinks?: {
        website?: string,
        Linkedin?: string,
        youtube?: string,
    }
}



const userSchema = new Schema <Iuser> ({
    userName:{
        type:'string',
        required: [true,"Username is required"],
        maxLength: [20,"Username shouldn't be more than 20 characters"],
        unique: true
    },
    email:{
        type:String,
        required: [true,"Email is required"],
        unique: true
    },
    password:{
        type:"string",
        required: true,
        select:false
    },
    role:{
        type:"string",
        required:true,
        enum: {
            values : ['admin','user'],
            message: '{VALUE} is not supported'
        },
        default:'user'
    },
    firstName:{
        type:"string",
        maxLength: [20 ,"Not more than 20 characters"]

    },
    lastName:{
        type:"string",
        maxLength: [20 ,"Not more than 20 characters"]
    },
    socialLinks:{
        website:{
            type:"string",
            maxLength: [100,"Not more than 100 characters"]
        },
        Linkedin:{
            type:"string",
            maxLength: [100,"Not more than 100 characters"]
        },
        youtube:{
            type:"string",
            maxLength: [100,"Not more than 100 characters"]
        },
    }
},{timestamps:true});




/**
 * 
 * 
 * 
 * userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
        return;
    }

    // Hash the password
    this.password = await bcrypt.hash(this.password, 10);

    next();
});


pre save middleware 
 */



export default model<Iuser> ('User',userSchema);