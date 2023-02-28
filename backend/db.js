const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo = () => {
     mongoose.connect(mongoURI, ()=>{
          console.log('Connected to mongoose');
     })
}

module.exports = connectToMongo;