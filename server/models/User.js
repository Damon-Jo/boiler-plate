const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const jwt = require('jsonwebtoken');


const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //to remove the space between letter
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function(next){
    
    var user = this;

    if(user.isModified('password')){
        //password encryption
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err)
    
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err)
                user.password = hash
                next()
            });
        });  
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb){

    //plainPassword 1234567 ==? Bcrypt Password
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = async function(cb){

    var user = this;

    // generate token using jsonwebtoken
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = token
    // ->
    // 'secretToken' -> user._id
    user.token = token;

    await user
    .save()
    .then((user)=>{
        // if(err){
        //     console.log('err', err)
        //     return cb(err)
        // }
        cb(null, user)
    })


    // user.save(function(err, user){
    //     if(err) return cb(err);
    //     cb(null, user)
    // })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    
    // decode token
    jwt.verify(token, 'secretToken', function(err, decoded){
        // find the user using id
        // client token id ==? DB token id
        user.findOne({"_id": decoded, "token": token})
        .then((user)=>{
            // if(!user) return cb(err);
            cb(null, user)
        })
        .catch((err)=>{
            console.log('err', err)
            cb(err)
        })
    })

}




const User = mongoose.model('User', userSchema)

module.exports = {User}
