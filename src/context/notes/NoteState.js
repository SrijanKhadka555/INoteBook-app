
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
     const host = "http://localhost:5000";
     const initialNote = [];
     const [notes, setNotes] = useState(initialNote);

     // Fetch notes
     const fetchNotes = async () => {
          // API call
          const response = await fetch(`${host}/api/notes/fetchnotes`, {
               method: "GET",
               headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
               },
          });
          const json = await response.json();
          console.log(json);
          setNotes(json);
     }

     // add a note
     const addNote = async (title, description, tag) => {
          // API call
          const response = await fetch(`${host}/api/notes/addnotes`, {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
               },

               body: JSON.stringify({ title, description, tag }),
          });
          const note = await response.json();
          setNotes(notes.concat(note));
     }
     // delete a note
     const deleteNote = async (id) => {
          // TODO API call
          const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
               method: "DELETE",
               headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
               },
          });
          const json = await response.json();
          console.log(json);

          const newNote = notes.filter((note) => { return note._id !== id });
          setNotes(newNote);
     }
     // edit a note
     const editNote = async (id, title, description, tag) => {
          // API call
          const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
               method: "PUT",
               headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
               },

               body: JSON.stringify({ title, description, tag }),
          });
          const json = await response.json();
          console.log(json);

          // logic to edit in client
          const newNote = JSON.parse(JSON.stringify(notes));
          for (let index = 0; index < newNote.length; index++) {
               const element = newNote[index];
               if (element._id === id) {
                    newNote[index].title = title;
                    newNote[index].description = description;
                    newNote[index].tag = tag;
                    break;
               }
          }
          setNotes(newNote);
     }

     return <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, fetchNotes }}>
          {props.children}
     </NoteContext.Provider>
}

export default NoteState;