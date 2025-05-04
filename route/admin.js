const express = require('express')
const router = express.Router();
const Incident = require('../collection/Incidents');
const authJWTController = require('../utils/jwtAuthentication');
const isAdmin = require('../utils/isAdmin');

// Get all of the verified incidents
router.get('/incidents', authJWTController.isAuthenticated, async (req, res) => {

    // Check that the user has administrative privileges
    if (!isAdmin(req.user.email)) return res.status(401).send('Unauthorized');

    // Retrieve the number of unverified incidents in the collection
    incidentCount = await Incident.countDocuments({isVerified: false});

    Incident.aggregate([
        {
            $match: {
                isVerified: false
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

// Get a specific incident
router.get('/incidents/:incidentID', authJWTController.isAuthenticated, async (req, res) => {

    // Check that the user has administrative privileges
    if (!isAdmin(req.user.email)) return res.status(401).send('Unauthorized');

    Incident.findById(req.params.incidentID)
        .then((results) => {
            if (results) {
                res.status(200).json({success: true, incident: results}); // 200 OK
            } else {
                res.status(404).json({success: false, message: 'Incident not found.'}); // 404 Not Found
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({success: true, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
        });

});

// Verify a specific incident
router.put('/incidents/:incidentID', authJWTController.isAuthenticated, async (req, res) => {

    // Check that the user has administrative privileges
    if (!isAdmin(req.user.email)) return res.status(401).send('Unauthorized');

    Incident.updateOne({_id: req.params.incidentID}, {$set: req.body})
        .then((results) => {
            if (results.modifiedCount === 1) {
                res.status(200).json({success: true, message: 'Incident successfully updated.'}); // 200 OK
            } else {
                res.status(404).json({success: false, message: 'Incident not found.'}); // 404 Not Found
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({success: true, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
        });

});

// Delete a specific incident
router.delete('/incidents/:incidentID', authJWTController.isAuthenticated, async (req, res) => {

    // Check that the user has administrative privileges
    if (!isAdmin(req.user.email)) return res.status(401).send('Unauthorized');

    Incident.findByIdAndDelete(req.params.incidentID)
        .then((results) => {
            if (results) {
                res.status(200).json({success: true, message: 'Incident successfully deleted.'}); // 200 OK
            } else {
                res.status(404).json({success: false, message: 'Incident not found.'}); // 404 Not Found
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({success: true, message: 'Something went wrong. Please try again later.'}); // 500 Internal Server Error
        });

});

module.exports = router;
