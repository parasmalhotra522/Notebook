import express from 'express';
import { authGuard } from '../middlewares/authGuard.js';
import { fetchAllNotes, createNote, updateNote, deleteNote } from '../controllers/notesController.js';
import { body } from 'express-validator';

const router = express.Router();

// ---- Route 1 : /GET : Fetch all the notes for the logged-in user
router.get('/fetchNotes', authGuard, fetchAllNotes);


// ---- Route 2: /POST: Create the note for the loggedIn user
router.post('/createNote',  authGuard,
    [
        body('title', "Title should be alteast 4 characters long").isLength({min:3}),
        body('description', "Description should be atleast 10 characters long").isLength({min:10, max:200}),
        body('tag', "Tag is required").isLength({min:1})            
    ],
    
    createNote);


// ---- Route 3: /PUT: Updating the exisiting note

router.put('/updateNote/:id', authGuard, updateNote);


// --- Route 4: /DELETE: Deleting the existing note
router.delete('/deleteNote/:id', authGuard, deleteNote);

export default router;





