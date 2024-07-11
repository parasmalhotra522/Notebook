import mongoose from "mongoose";

const notesSchema = mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    title: {
        type:String,
        required:true
    },
    description: {
        type:String,
        required:true,
    },
    tag: {
        type:String,
        required:true
    },
 
    date: {
        type:Date,
        default:Date.now
    }
}, {
    timestamps:true
});


 export default new mongoose.model('Notes', notesSchema);
