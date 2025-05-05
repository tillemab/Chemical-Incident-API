const express = require('express')
const router = express.Router();
const User = require('../collection/Users');

router.post('/', async (req, res) => {
    
    // Check that the request body has an email, username, and password
    if (!req.body.email) return res.status(400).json({success: false, message: 'The request body must contain an email.'}); // 400 Bad Request
    if (!req.body.username) return res.status(400).json({success: false, message: 'The request body must contain a username.'}); // 400 Bad Request
    if (!req.body.password) return res.status(400).json({success: false, message: 'The request body must contain a password.'}); // 400 Bad Request

    const user = new User({
        email: req.body.email, 
        username: req.body.username, 
        password: req.body.password
    });

    user.save()
        .then((results) => {
            console.log(`New user ${req.body.email} successfully created`);
            res.status(201).json({success: true, message: 'Successfully created new user.'}); // 201 Created
        })
        .catch((err) => {
            console.log(`Could not create new user ${req.body.email}`);
            if (err.code === 11000) {
                res.status(409).json({success: false, message: 'Sign-up failed. A user with that email already exists.'}); // 409 Conflict
            } else {
                console.error(err);
                res.status(500).json({success: false, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
            };
        });

});

module.exports = router;