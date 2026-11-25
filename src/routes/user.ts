
import {Router} from 'express';
import {param, query, body} from 'express-validator';


import validationError from '@/middleware/validationError';
import authenticate from '@/middleware/authenticate';
import authorize from '@/middleware/authorize';

import User from '@/models/user';



import getCurrentUser from '@/controllers/user/get_current_user';
import updateCurrentUser from '@/controllers/user/update_current_user';
import deleteCurrentUser from '@/controllers/user/delete_current_user';
import getAllUser from '@/controllers/user/get_all_user';
import getUserById from '@/controllers/user/getUserById';
import deleteUserById from '@/controllers/user/delete_user_by_id';


const router = Router();



router.get("/current",
            authenticate,
            authorize(['admin','user']),
            getCurrentUser
)

router.patch("/current",
    authenticate,
    authorize(['admin','user']),

    body('userName')
    .optional()
    .trim()
    .isLength({min:3,max:20})
    .withMessage("User name should be between 3 to 20 characters")
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({
        userName: value,
        _id: { $ne: req.userId }
      });

      if (existingUser) {
        throw new Error("Username is already taken");
      }

      return true;
    }),
    validationError,

    updateCurrentUser
)

router.delete("/current",
    authenticate,
    authorize(['admin','user']),
    deleteCurrentUser
)


// for admin purpose

router.get("/",
            authenticate,
            authorize(['admin']),
            getAllUser
)


router.get("/:userId",
    authenticate,
    authorize(['admin']),
    param('userId')
    .notEmpty()
    .withMessage("User Id is required")
    .isMongoId()
    .withMessage("User Id should be a valid MongoDB ObjectId"),
    validationError,
    getUserById
    )   


router.delete("/:userId",
    authenticate,
    authorize(['admin']),
    param('userId')
    .notEmpty()
    .withMessage("User Id is required")
    .isMongoId()
    .withMessage("User Id should be a valid MongoDB ObjectId"),
    validationError,
    deleteUserById
    )  

export default router;


