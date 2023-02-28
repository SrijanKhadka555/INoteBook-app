const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator'); //using express-validator
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "skisaniceguy";

// Route 1: create usre using: POST '/api/auth/createuser' . No login required
router.post('/createuser', [
     body('name', 'Enter valid name').isLength({ min: 5 }),
     body('email', 'Enter valid email').isEmail(),
     body('password', 'Enter valid password').isLength({ min: 5 }),
] , async (req, res) =>{
     // console.log(req.body);
     // const user = User(req.body);
     // user.save();

     // If there are errors, return bad request and errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
     }
     // Check wether the user with this email exist already
     try {
          
     
     let user = await User.findOne({email: req.body.email});
     if (user){
          return res.status(400).json({ errors: "Enter a unique email address"})
     }

     const salt = await bcrypt.genSalt(10);
     const secPass = await bcrypt.hash(req.body.password, salt);
     // create a user
     user = await User.create({
          name: req.body.name,
          email: req.body.email,
          password: secPass,
     })
     data = {
          user:{
               id: user.id
          }
     }
     const authToken = jwt.sign(data, JWT_SECRET);
     res.json(authToken);

     } 
     catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");
     }

     // .then(user => res.json(user))
     // .catch(err => {console.log(err)
     // res.json({error: "unique email required", message: err.message})})

     // res.send(req.body);
})



// Route 2: Authentication check of email and password: POST '/api/auth/login' . No login required
router.post('/login', [
     body('email', 'Enter valid email').isEmail(),
     body('password', 'blank password').exists(),
] , async (req, res) =>{

     // If there are errors, return bad request and errors
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
     }

     const {email, password} = req.body;

     try {
          let user = await User.findOne({email})
          if(!user){
               return res.status(400).json({ errors: "Enter valid cridencial"})
          }

          const passCompare = await bcrypt.compare(password, user.password);
          if(!passCompare){
               return res.status(400).json({ errors: "Enter valid cridencial"})
          }

          data = {
          user:{
               id: user.id
          }
          }
     const authToken = jwt.sign(data, JWT_SECRET);
     res.json(authToken);

     } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");
     }
})

// Route 3: get logedin user details : POST '/api/auth/getuser'. login required
router.post('/getuser', fetchuser , async (req, res) =>{

     try {
          userID = req.user.id;
          const user = await User.findById(userID).select("-password");
          res.send(user);
     } catch (error) {
          console.error(error.message);
          res.status(500).send("Internal server error");
     }
})

module.exports = router;