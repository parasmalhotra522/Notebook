import expressAsyncHandler from "express-async-handler";
import Notes from '../models/NotesModel.js';
import { validationResult } from 'express-validator';


export const fetchAllNotes = expressAsyncHandler(async (req, res) => {
    try {
        const notes = await Notes.find({user: req.userId});
        res.status(200).json({notes:notes});


    } catch (error) {
        res.status(500).json({error:error});
        throw new Error(error);
    }
});

// ---- Creating a new note

export const createNote = expressAsyncHandler(async(req, res) => {

    try {
         const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({error:errors.array()});
        }

        const {title, description, tag} = req.body;
        
        if (!title || !description || !tag ) {
            res.status(400);
            throw new Error("Please enter all the mandatory fields");
        }

        // Create a note 
         const note = await Notes.create({
            title:title,
            description: description,
            tag: tag,
            user:req.userId
        })
        console.log('New note created ', note);
        res.status(201).json({message: `New Note ${title} added successfully!!`,
        notes: note
        })

    } catch (error) {
        res.status(400);
        console.log(error)
        throw new Error("Failed to create the note")
   
    }

});


// --- Updating the existing note
export const updateNote = expressAsyncHandler(async(req, res) => {
    try {
        const noteId = req.params.id;
        const {title, description, tag} = req.body;
        
        if(!noteId) {
            res.status(400);
            throw new Error("Need noteId to update a note");
        }

        // we are checking if the note exists so is the loggedIn user same as the 
        // one trying to update it
        let note = await Notes.findById({_id:noteId});

        if (!note) {
            res.status(404).send({message:'Note not found'});
        }
        if (note.user.toString() !== req.userId) {
            res.status(401).send({message:'Not allowed'});
        }

         const updatedNote = await Notes.findByIdAndUpdate(
            noteId,{ $set: {
                        title:title,
                        description: description,
                        tag: tag,
                    }}, { new:true }
            );
            console.log(updatedNote)
            
     
        res.status(200).json({
            message:`Note ${noteId} Updated Successfully`, 
            notes:updatedNote
        });

    } catch (error) {
               res.status(500);
            throw new Error("Error creating the note", error);
         
    }
});


export const deleteNote = expressAsyncHandler(async(req, res) => {

    try {
        const noteId = req.params.id;
        if(!noteId) {
            res.status(400);
            throw new Error(`No note exists with given NoteId ${noteId}`);
        }
        // we are checking if the note exists so is the loggedIn user same as the 
        // one trying to update it
        let note = await Notes.findById({_id:noteId});

        if (!note) {
            res.status(404).send({message:'Note not found'});
        }
        if (note.user.toString() !== req.userId) {
            res.status(401).send({message:'Not allowed'});
        }
        note = await Notes.findByIdAndDelete({_id:noteId})
        console.log("Deleting a note", note);
        res.status(200).json({message: `Note with NoteId ${noteId} deleted Successfully`,
            notes: await Notes.find({user: req.userId})
        })

    } catch (error) {
            res.status(500);
            throw new Error("Error deleting the note", error);
    
    }

});
