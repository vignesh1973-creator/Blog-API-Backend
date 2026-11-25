
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import helmet from "helmet";

import type {Server} from 'node:http';


import config from '@/config'
import limiter from '@/lib/express_rate_limit_'
import rootRoute from '@/routes/index'
import type { CorsOptions } from "cors";

import { connectToDatabase,disconnectFromDatabase } from "./lib/mongoose";






const app = express();

let server : Server | undefined


const corsoptions :CorsOptions = {
    origin(origin,callback) {
        if(config.NODE_ENV === "development" || !origin || config.WHITELIST_ORIGINS.includes(origin)){
            callback(null, true)
        }
        else{
            callback(new Error("CORS Error"), false)
        }
    }
}


app.use(cors(corsoptions))



app.use(cookieParser());


app.use(compression({
    threshold: 1024
}));

app.use(helmet())


app.use(express.json())

app.use(express.urlencoded({extended:true}))


app.use(limiter);


(async() => {

    
    await connectToDatabase()



    app.use("/api/v1",rootRoute);

     server = app.listen(config.PORT,()=>{
        console.log(`Server running on http://localhost:${config.PORT}`);
        
    });

    server.on("error",(err)=>{
        console.log("failed to start",err);

        if(config.NODE_ENV === "production"){
            process.exitCode = 1;
        }
        
    })


}) ();   //IIFE(immediately invoked function expression)  => (async()=>{})()  




const handleServerShutdown = async()=>{

    console.log("Server shutdown Initated");
    

    if(!server){
        process.exitCode = 0;
    }

     await disconnectFromDatabase();

    server?.close((err)=>{
        if(err){
            console.log("Failed to shutdown server",err);
            process.exitCode = 1;
            return;
        }

       

        console.log("Server shutdown successfully");
        process.exitCode = 0;
        
    })

}



process.on("SIGTERM",handleServerShutdown);
process.on("SIGINT",handleServerShutdown);

