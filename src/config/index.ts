


import dotenv from "dotenv";

import type  ms from 'ms';

dotenv.config();



const config ={
    PORT : process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ["http://localhost:5173"],
    MONGO_URI: process.env.MONGO_URI,
    JWT_ACCESS_SECRET : process.env.JWT_ACCESS_SECRET,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY as ms.StringValue,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY as ms.StringValue,
    WHITELIST_EMAIL_LIST:  [
        'vigneshvignesh1974@gmail.com',
        'vicky29@gmail.com'
    ].map(email => email.toLowerCase()),
    defaultResLimit: 10,
    defaultResOffset: 0,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
};


export default config;