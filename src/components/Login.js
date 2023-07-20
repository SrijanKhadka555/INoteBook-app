import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = (props) => {
     const [credensial, setCredensial] = useState({ email: "", password: "" })
     let navigate = useNavigate();
     const handleSubmit = async (e) => {
          e.preventDefault();

          const response = await fetch("http://localhost:5000/api/auth/login", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
               },

               body: JSON.stringify({ email: credensial.email, password: credensial.password }),
          });
          const json = await response.json();
          console.log(json);
          if (json.success === "True") {
               // saving authToken and Redirect
               localStorage.setItem('token', json.authToken);
               props.showAlert("Successfully Login", "success");
               navigate("/");
          }
          if (json.success === "False") {
               props.showAlert("Invalid detail", "danger");
          }


          // fetching user data
          const user = await fetch("http://localhost:5000/api/auth/getuser", {
               method: "POST",
               headers: {
                    "Content-Type": "application/json",
                    "auth-token": localStorage.getItem('token')
               },
          });
          const userData = await user.json();
          console.log(userData.name);
     }
     const onchange = (e) => {
          setCredensial({ ...credensial, [e.target.name]: e.target.value })
     }
     return (
          <div className='mt-3'>
               <h2 className='my-3'>Login to Continue inotebook</h2>
               <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                         <label htmlFor="email" className="form-label">Email address</label>
                         <input type="email" className="form-control" id="email" name='email' value={credensial.email} onChange={onchange} aria-describedby="emailHelp" />
                    </div>
                    <div className="mb-3">
                         <label htmlFor="password" className="form-label">Password</label>
                         <input type="password" className="form-control" id="password" name='password' value={credensial.password} onChange={onchange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
               </form>
          </div>
     )
}

export default Login
