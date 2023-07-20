import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from '../context/notes/noteContext';
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = (props) => {
     const context = useContext(noteContext);
     const navigate = useNavigate();
     const { notes, fetchNotes, editNote } = context;
     useEffect(() => {
          if (localStorage.getItem('token')) {
               fetchNotes()
          }
          else {
               props.showAlert("Please login first", "danger");
               navigate('/login');
          }
          // eslint-disable-next-line 
     }, []);

     const ref = useRef(null)
     const refClose = useRef(null)
     const [note, setNote] = useState({ id: "", etitle: "", edescription: "", etag: "" })

     const updateNote = (currentNote) => {
          ref.current.click();
          setNote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description, etag: currentNote.tag });
     }

     const handleAddNote = (e) => {
          editNote(note.id, note.etitle, note.edescription, note.etag);
          refClose.current.click();
          props.showAlert("Successfully Updated", "success");
     }

     const onchange = (e) => {
          setNote({ ...note, [e.target.name]: e.target.value })
     }


     return (
          <>
               <AddNote showAlert={props.showAlert} />

               <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Launch demo modal
               </button>


               <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                         <div className="modal-content">
                              <div className="modal-header">
                                   <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
                                   <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                   <form className="my-3">
                                        <div className="mb-3">
                                             <label htmlFor="title" className="form-label">Title</label>
                                             <input type="text" className="form-control" id="etitle" value={note.etitle} name='etitle' aria-describedby="emailHelp" onChange={onchange} minLength={5} required />
                                        </div>
                                        <div className="mb-3">
                                             <label htmlFor="description" className="form-label">Description</label>
                                             <input type="text" className="form-control" id="edescription" value={note.edescription} name='edescription' onChange={onchange} minLength={5} required />
                                        </div>
                                        <div className="mb-3">
                                             <label htmlFor="tag" className="form-label">Tag</label>
                                             <input type="text" className="form-control" id="etag" value={note.etag} name='etag' onChange={onchange} minLength={3} required />
                                        </div>
                                   </form>
                              </div>
                              <div className="modal-footer">
                                   <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                   <button disabled={note.etitle.length < 5 || note.edescription.length < 5} type="button" onClick={handleAddNote} className="btn btn-primary">Update note</button>
                              </div>
                         </div>
                    </div>
               </div>
               <div className="row my-3">
                    <h1>Your Notes</h1>
                    <div className="container my-3 mx-2">
                         {notes.length === 0 && "Please add a note"}
                    </div>
                    {notes.map((note) => {
                         return <Noteitem key={note._id} updateNote={updateNote} showAlert={props.showAlert} note={note} />;
                    })}
               </div>
          </>
     )
}

export default Notes
