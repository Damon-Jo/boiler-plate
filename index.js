const express = require('express')
const app = express()
const port = 5000

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const config = require('./config/key');
const {auth} = require("./middleware/auth");

const {User} = require("./models/User");

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));
//application/json
app.use(bodyParser.json());
app.use(cookieParser());



const mongoose = require('mongoose')
// console.log(config.mongoURI)
mongoose.connect(config.mongoURI)
.then(()=> console.log('MongoDB Connected..'))
.catch(err=> console.log(err))


app.get('/', (req, res) => {
  res.send('Hello World! Your man')
})

app.post('/api/users/register', async (req,res)=>{
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


app.post('/api/users/login', (req,res)=>{
  //1. find the email in database
  User.findOne({email:req.body.email})
  .then(docs=>{
    if(!docs){
      return res.json({
          loginSuccess: false,
          message: "Auth failed, email not found"
      })
    }
    //2. if there is the email, compare the password
    docs.comparePassword(req.body.password, (err, isMatch)=>{
      console.log("isMatch", isMatch)
      if(!isMatch) return res.json({loginSuccess: false, message: "wrong password"})

      //3. if the password is correct, generate the token
      docs.generateToken((err, user)=>{
        if(err) {
          console.log(err)
          return res.status(400).send(err);
        }
        // console.log("user", user)
        //save the token in cookie
        res.cookie("x_auth", user.token)
        .status(200)
        .json({loginSuccess: true, userId: user._id})
      })
    })
    
  })
  .catch(err=>{
    return res.status(400).send(err);
  })
})


// role 1: admin
// role 0: normal user (role !=0 is admin)
app.get('/app/users/auth', auth, (req,res)=>{
  // if the user is authenticated, then the middleware will be executed
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image

  })

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})