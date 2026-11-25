
import mongoose from "mongoose";


import config from "@/config";

import type { ConnectOptions } from "mongoose";



const clientOptions : ConnectOptions = {
    dbName: "blog_db",
    appName: "BLOG API",
    serverApi:{
        version: '1',
        strict:true,
        deprecationErrors:true
    }
};



export const connectToDatabase = async(): Promise<void> =>{
    
    if(!config.MONGO_URI){
        throw new Error("MONGO_URI is not defined in configuration");
    }

    try {

         await mongoose.connect(config.MONGO_URI,clientOptions)

         console.log("Database connected successfully");
         
        
    } catch (error) {
        
        console.error("Database connection failed:", error);

        throw error;        
    }
};



export const disconnectFromDatabase = async():Promise<void> =>{
    try {
        await mongoose.disconnect();
        console.log("Database disconnected succesfully");
        
    } catch (error) {
            console.error("Database disconnection failed:", error);

            throw error;
        
    }
}