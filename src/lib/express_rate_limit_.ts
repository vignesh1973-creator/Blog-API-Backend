

import {rateLimit} from 'express-rate-limit';



const limiter = rateLimit({
    windowMs: 60000,
    limit:60,
    standardHeaders:"draft-8",
    legacyHeaders:false,
    message:{
        error: 
            "You have sent so many requests within the given amolunt of time . So please try again later"
    }
});


export default limiter;