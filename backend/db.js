const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const mongoURI = "mongodb://localhost:27017/"

// const connectToMongo = () => {
//      mongoose
//      .connect(mongoURI)
//      .then(() => console.log("Connected to mongoose"))
//      .catch((err) => console.log(err));
//      };
const connectToMongo = () => {
     mongoose.connect(mongoURI, ()=>{
          console.log('Connected to mongoose');
     })
}

module.exports = connectToMongo;