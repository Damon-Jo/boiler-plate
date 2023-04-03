const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');

const config = require('./config/key');

const {User} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());



const mongoose = require('mongoose')
// console.log(config.mongoURI)
mongoose.connect(config.mongoURI)
.then(()=> console.log('MongoDB Connected..'))
.catch(err=> console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! Your man')
})

app.post('/register', async (req,res)=>{
  // when the data is loaded from client,
  // this api put the data to database

  const user = new User(req.body)
  await user
  .save()
  .then(() => {
    res.status(200).json({
      success: true,
    });
  })
  .catch((err) => {
    console.error(err);
    res.json({
      success: false,
      err: err,
    });
  });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})