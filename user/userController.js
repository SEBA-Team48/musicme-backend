
var Config = require('../config/config.js');
var User = require('./userSchema');
var jwt = require('jwt-simple');

module.exports.login = function(req, res){

    if(!req.body.username){
        res.status(400).send('username required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }

    User.findOne({username: req.body.username}, function(err, user){
        if (err) {
            res.status(500).send(err);
            return
        }

        if (!user) {
            res.status(401).send('Invalid Credentials');
            return;
        }
        user.comparePassword(req.body.password, function(err, isMatch) {
            if(!isMatch || err){
                res.status(401).send('Invalid Credentials');
            } else {
                res.status(200).json({token: createToken(user)});
            }
        });
    });

};

module.exports.signup = function(req, res){
    if(!req.body.username){
        res.status(400).send('username required');
        return;
    }
    if(!req.body.password){
        res.status(400).send('password required');
        return;
    }
    if(!req.body.fname){
        res.status(400).send('first name required');
        return;
    }
    if(!req.body.lname){
        res.status(400).send('last name required');
        return;
    }
    if(!req.body.emailadress){
        res.status(400).send('emailadress required');
        return;
    }
	/*add lines above for fname,lname,email*/
	
    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;
	user.fname= req.body.fname;
	user.lname=req.body.lname;
	user.emailadress=req.body.emailadress;
    user.is_teacher=req.body.is_teacher;

    user.save(function(err) {
        if (err) {
            res.status(500).send(err);
            return;
        }

        res.status(201).json({token: createToken(user)});
    });
};

module.exports.unregister = function(req, res) {
    req.user.remove().then(function (user) {
        res.sendStatus(200);
    }, function(err){
        res.status(500).send(err);
    });
};

// Create endpoint /api/user/:user_id for GET
exports.getUser = function(req, res) {
    // Use the lesson model to find a specific lesson
    User.findById(req.params.user_id, function(err, user) {
        if (err) {
            res.status(500).send(err)
            return;
        };

        res.json(user);
    });
};
// Create endpoint /api/user/:user_id for PUT
exports.putUser = function(req, res) {
    // Use the Lesson model to find a specific lesson and update it
    User.findByIdAndUpdate(
        req.params.user_id,
        req.body,
        {
            //pass the new object to cb function
            new: true,
            //run validations
            runValidators: true
        }, function (err, user) {
            if (err) {
                res.status(500).send(err);
                return;
            }
            res.json(user);
        });
};

function createToken(user) {
    var tokenPayload = {
        user: {
            _id: user._id,
            username: user.username,
            is_teacher: user.is_teacher
        }

    };
    return jwt.encode(tokenPayload,Config.auth.jwtSecret);
};