const connectToMongo = require('./db');
connectToMongo();

const express = require('express')
const app = express()
const port = 3000

app.use(express.json()); //for using request.body



// Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

// const start = async () => {
//      try {
//      await connectToMongo();
//      app.listen(port, () => {
//           console.log(`Connected to ${port}`);
//      });
//      } catch (error) {
//      console.log(error);
//      }
// };
app.listen(port, () => {
     console.log(`Example app listening on port ${port}`)
})