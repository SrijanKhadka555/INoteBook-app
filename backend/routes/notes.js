const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
var fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Route 1: Fetch all notes using: Get '/api/notes/fetchnotes' .login required
try {
     router.get('/fetchnotes', fetchuser , async (req, res) =>{
          const notes = await Note.find({user: req.user.id});
          res.json(notes);
     })
     
} catch (error) {
     console.error(error.message);
          res.status(500).send("Internal server error");
}

// Route 2: Add notes using: Get '/api/notes/addnotes' .login required
router.post('/addnotes', fetchuser , [
     body('title', 'Enter proper title').isLength({ min: 3 }),
     body('description', 'Enter more description').isLength({ min: 5 }),
], async (req, res) =>{
     try {
          
     const {title, description,tag} = req.body;
     // If there are errors, return bad request and errorss
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
     }
     const note = new Note({
          title, description,tag, user : req.user.id
     })
     const saveNote = await note.save();
     res.json(saveNote);

     } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");
     }
})
// Route 3: Update notes using: Put '/api/notes/updatenote' .login required
router.put('/updatenote/:id', fetchuser, async (req, res) =>{
     try {
          
     const {title, description, tag} = req.body;
     // create a newNote object
     const newNote = {};
     if(title){newNote.title = title};
     if(description){newNote.description = description};
     if(tag){newNote.tag = tag};

     // find the note to be updated and update it
     let note = await Note.findById(req.params.id);
     if(!note){return res.status(404).send("Not Found")} //Note nor found


     if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not Allowed") //Not a valid user
     }

     note = await Note.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
     res.json({note});

     } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");
     }
})

// Route 4: Delete existing note using: DELETE '/api/notes/deletenote' .login required
router.delete('/deletenote/:id', fetchuser, async (req, res) =>{
     try {
          
     // find the note to be updated and update it
     let note = await Note.findById(req.params.id);
     if(!note){return res.status(404).send("Not Found")} //Note nor found


     if(note.user.toString() !== req.user.id){
          return res.status(401).send("Not Allowed") //Not a valid user
     }

     note = await Note.findByIdAndDelete(req.params.id);
     res.json({'sucess' : 'Note is deleted',note:note});

     } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");
     }
})

module.exports = router;