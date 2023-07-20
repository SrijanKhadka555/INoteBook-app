import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Signup = (props) => {
     const [credensial, setCredensial] = useState({ name: "", email: "", password: "", cpassword: "" })
     let navigate = useNavigate();
     const handleSubmit = async (e) => {
          e.preventDefault();
          const { name, email, password } = credensial;
          const response = await fetch("http://localhost:5000/api/auth/createuser", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },

               body: JSON.stringify({ name, email, password }),
          });
          const json = await response.json();
          console.log(json);
          if (json.success === "True") {
               // saving authToken and Redirect
               localStorage.setItem('token', json.authToken);
               navigate("/login");
               props.showAlert("Successfully Signup", "success");
               localStorage.removeItem('token');
          }
          if (json.success === "False") {
               props.showAlert("Invalid details", "danger");
          }
     }
     const onchange = (e) => {
          setCredensial({ ...credensial, [e.target.name]: e.target.value })
     }
     return (
          <div className='container mt-2'>
               <h2 className='my-3'>Create an account to use inotebook</h2>
               <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                         <label htmlFor="name" className="form-label">Name</label>
                         <input type="text" className="form-control" id="name" name='name' aria-describedby="emailHelp" onChange={onchange} />
                    </div>
                    <div className="mb-3">
                         <label htmlFor="email" className="form-label">Email address</label>
                         <input type="email" className="form-control" id="email" name='email' aria-describedby="emailHelp" onChange={onchange} />
                    </div>
                    <div className="mb-3">
                         <label htmlFor="password" className="form-label">Password</label>
                         <input type="password" className="form-control" id="password" name="password" onChange={onchange} minLength={5} required />
                    </div>
                    <div className="mb-3">
                         <label htmlFor="password" className="form-label">Conform Password</label>
                         <input type="password" className="form-control" id="cpassword" name="cpassword" onChange={onchange} minLength={5} required />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit</button>
               </form>
          </div>
     )
}

export default Signup
