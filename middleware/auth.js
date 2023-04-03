const { User } = require('../models/User');

let auth = (req, res, next) => {
    // authentication
    // 1. get the token from client cookie
    let token = req.cookies.x_auth;
    
    // 2. decode the token and get the user id
    User.findByToken(token, (err, user) => {
        if (err) throw err;
        if (!user) return res.json({ isAuth: false, error: true })

        req.token = token;
        req.user = user;
        next();
    })


    // 3. if the user id exists, then the user is authenticated

    // 4. if the user is not authenticated, then return error

}

module.exports = { auth };