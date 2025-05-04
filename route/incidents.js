const express = require('express')
const router = express.Router();
const Incident = require('../collection/Incidents');
const authJWTController = require('../utils/jwtAuthentication');
const listValidationErrors = require('../utils/listValidationErrors');

// Get all of the verified incidents
router.get('/', async (req, res) => {

    // Retrieve the number of verified incidents in the collection
    incidentCount = await Incident.countDocuments({isVerified: true});

    if (req.query.limit) {

        // Attempt to convert the limit query parameter to an integer
        const queryLimit = parseInt(req.query.limit);

        // Check that the limit query parameter is a number
        if (isNaN(queryLimit)) return res.status(400).json({success: false, message: 'The limit parameter must be an integer!'});

        // Check that the limit query parameter not less than zero
        if (queryLimit < 0) return res.status(400).json({success: false, message: 'The limit parameter must be at least 0!'});

    };

    if (req.query.skip) {

        // Attempt to convert the skip query parameter to an integer
        const querySkip = parseInt(req.query.skip);

        // Check that the skip query parameter is a number
        if (isNaN(querySkip)) return res.status(400).json({success: false, message: 'The skip parameter must be an integer!'});

        // Check that the skip query parameter not less than zero
        if (querySkip < 0) return res.status(400).json({success: false, message: 'The skip parameter must be at least 0!'});

    };

    Incident.aggregate([
        {
            $match: {
                isVerified: true
            }
        }, 
        {
            $project: {
                date: 1, 
                companyName: 1,
                facilityCity: 1, 
                facilityState: 1, 
                wasFatality: 1, 
                wasSeriousInjury: 1, 
                wasSubstantialPropertyDamage: 1, 
                reportURL: 1
            }
        },
        {
            $sort: {
                date: -1
            }
        },
        {
            $skip: req.query.skip ? parseInt(req.query.skip) : 0
        },
        {
            $limit: req.query.limit ? parseInt(req.query.limit) : 10
        }
    ])
        .then((results) => {
            res.status(200).json({success: true, total: incidentCount, incidents: results}); // 200 OK
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({success: false, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
        });

});

// Submit a new incident
router.post('/', authJWTController.isAuthenticated, async (req, res) => {

    // Add required reporter information if missing
    req.body.reporterName = req.body.reporterName ? req.body.reporterName : req.user.username,
    req.body.reporterEmail = req.body.reporterEmail ? req.body.reporterEmail : req.user.email,

    // Ensure that the isVerified field is set to false
    req.body.isVerified = false;

    Incident.create(req.body)
        .then((results) => {
            res.status(201).json({success: true, message: 'Incident created pending approval', incident: results}); // 201 Created
        })
        .catch((err) => {
            if (err.name === "ValidationError") {
                res.status(400).json({success: false, message: 'Invalid incident.', problems: listValidationErrors(err)}); // 400 Bad Request
            } else {
                console.error(err);
                res.status(500).json({success: false, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
            }
        });

});

module.exports = router;
