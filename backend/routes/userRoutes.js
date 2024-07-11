import express from 'express';
import { registerUser, logInUser, getUser, logOut } from '../controllers/authController.js'; 
import { body } from 'express-validator';
import { authGuard } from '../middlewares/authGuard.js';

const router = express.Router();

// --- Register/SignUp the new user
router.post('/',  [body('name', "Enter a valid Name").isLength({min:3}),
                    body('emailId', "Enter a valid Email Id").isEmail(),
                    body('password', "Enter a valid Password").isLength({min:5})
                ],
             registerUser);


// ------ LogIn User

router.post('/logIn', [
            body('emailId', "Enter a valid Email Id").isEmpty(),
            body('password', "Enter a valid Password").isEmpty()
],
logInUser
);

//--- Get user

router.get('/getUser',authGuard, getUser);

router.get('/logOut', authGuard, logOut);

export default router;