const User = require('../models/user');
const { check , validationResult } = require('express-validator');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    const user = new User(req.body);
    user.save((err , user) => {
        if(err){
            return res.status(400).json({
                err: "Not able to save user into DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
}


exports.signin = (req, res) => {
    const { email , password } = req.body;

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email}, (err , user) => {
        if(err || !user){
            return res.status(400).json({
                error: "User doesn't exist"
            })
        }
        
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password doesn't match"
            })
        }
        
        //Token Creation
        const token = jwt.sign( {_id: user} , process.env.SECRET)
        //Put Token in Cookie
        res.cookie( "token" , token , {expire: new Date() + 9999});
        //Send response to FrontEnd
        const {_id , name , email , role } = user;
        res.json({token , user: {_id , name , email , role}});
    })

}

exports.signout = (req, res) => {
    res.clearcookie("token");
    res.json({
        message: "User Signout Successful"
    });
}

//protected routes
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
});

//custom middleware
exports.isAuthenticaed = (req,res,next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!checker) {
        return res.status(403).json({
            error: "Access Denied"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        res.status(403).json({
            message: "You are not an admin"
        })
    }
    next();
}