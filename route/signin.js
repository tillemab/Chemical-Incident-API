const express = require('express')
const router = express.Router();
const User = require('../collection/Users');
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {
    try {

        // Check that the request body has a username and password
        if (!req.body.email) return res.status(400).json({success: false, message: 'The request body must contain an email.'}); // 400 Bad Request
        if (!req.body.password) return res.status(400).json({success: false, message: 'The request body must contain a password.'}); // 400 Bad Request

        const user = await User.findOne({email: req.body.email}).select('email username password isAdmin');

        // Check that the user exists
        if (!user) return res.status(401).json({success: false, message: 'Authenticated failed. User not found.'}); // 401 Unauthorized

        // Check that the password matches
        const isMatch = await user.comparePassword(req.body.password);
        
        if (isMatch) {
            console.log(`Successful sign-in for ${req.body.email}`);
            const userToken = {id: user._id, email: user.email};
            const token = jwt.sign(userToken, process.env.SECRET_KEY, {expiresIn: '30m'})
            res.status(200).json({success: true, token: 'JWT ' + token, isAdmin: user.isAdmin}); // 200 OK
        } else {
            console.log(`Unsuccessful sign-in attempt for ${req.body.email}`);
            res.status(401).json({success: false, message: 'Authenticated failed. Incorrect password.'}); // 401 Unauthorized
        };

    } catch (err) {
        console.error(err);
        res.status(500).json({success: false, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
    }
});

module.exports = router;