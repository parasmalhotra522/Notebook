import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
 name: {
        type:String,
        required:true
    },
    emailId: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    profilePicture: {
        type:String,
        default:"https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    },

    date: {
        type:Date,
        default:Date.now
    }
}, {
    timestamps:true
});

export default mongoose.model('User', userSchema);


