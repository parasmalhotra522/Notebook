import asynchandler from 'express-async-handler';
import User from '../models/UserModel.js';
import { generateToken } from './auth.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';

const cookieOptions = {
    // httpOnly:true,
    // secure: process.env.NODE_ENV === 'production',
    sameSite:'strict',
    maxAge: 24*60*60*1000
}




export const registerUser = asynchandler(async(req, res) => {

    // console.log("checking request body", req.body);
    const { name, emailId, password, profilePicture } = req.body;
    try {  

    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({error:errors.array()});
    }

    if ( !name || !emailId || !password) {
        res.status(400);
        throw new Error("Please enter all the mandatory fields");
    }
    const userExists = await User.findOne({emailId});
    
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);


    const user = await User.create({
        name:name,
        emailId:emailId,
        password:encryptedPassword,
        profilePicture:profilePicture
    });
    // console.log("User ...check", user);

    if(user) {
        const token = generateToken(user._id);
        // setting the token in the cookie..
        res.cookie('jwt', token, cookieOptions);
        
        res.status(201).send({
            userId: user._id,
            name: user.name,
            emailId: user.emailId,
            profilePicture: user.profilePicture,
            token: token
        });
    } else {
        res.status(400);
        throw new Error("Failed to create the user")
    }

    } catch(error) {
         console.error("Error creating user:", error);
        res.status(500).send({ error: "Failed to create the user" });
    }
  

}); 




 export const logInUser = asynchandler(async(req, res) => {
        const { emailId, password } = req.body;
        const user = await User.findOne({emailId});
        // console.log("Checking user..body", req.body);
        // console.log("Checking user from db", user);
        // if user exists and password's match then and only then 
        // return the User...
        if (user && await (bcrypt.compare(password, user.password))) {
            const token = generateToken(user._id);
            res.cookie('jwt', token, cookieOptions);
            res.json({
                _id:user._id,
                name: user.name,
                emailId: user.emailId,
                profilePicture: user.profilePicture,
                token: token
            });
        
        } else {
            res.status(401);
            throw new Error("Invalid Email or Password");
        }
    });


export const getUser = asynchandler(async(req, res) => {
    try {
        const token = req.cookies.jwt;
        if(!token) {
            res.status(401).send("Unauthorized, no token provided");
        }

        console.log("Inside-- Get user", req.userId);
        const userId = req.userId;
        const user = await User.findById(userId).select('-password');
        res.status(200).send(user);
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Internal Server Error");
    }
});


export const logOut = asynchandler(async(req, res) => {

    try {
        await res.clearCookie('jwt',{
            // httpOnly: true,
            // secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        })
        console.log('checking if cookie still exist', req.cookies.jwt);
        res.status(200).send({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).send({message: 'OOps!! Something went wrong'})
    }


});