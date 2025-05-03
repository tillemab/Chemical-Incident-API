const mongoose = require('mongoose');
const connectDatabase = require('../utils/connectDatabase');

connectDatabase();

const ChemicalSchema = new mongoose.Schema({
    casName: {
        type: String,
        required: [true, "You must specify the Chemical Abstract Service (CAS) name."]
    },
    casNumber: {
        type: String,
        required: [true, "You must specify the Chemical Abstract Service (CAS) registry number."]
    },
    amountReleasedKg: {
        type: Number,
        min: [0, "The quantity released must be zero or positive."],
        default: null
    }
});

const IncidentSchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: [true, "You must provide an owner/operator."]
    },
    companyContactName: {
        type: String,
        default: null
    },
    companyContactTitle: {
        type: String,
        default: null
    },
    companyContactMobilePhone: {
        type: String,
        default: null
    },
    companyContactOfficePhone: {
        type: String,
        default: null
    },
    companyContactEmail: {
        type: String,
        default: null
    },
    reporterName: {
        type: String,
        required: [true, "You must provide the name of the person submitting the report."]
    },
    reporterTitle: {
        type: String,
        default: null
    },
    reporterMobilePhone: {
        type: String,
        default: null
    },
    reporterOfficePhone: {
        type: String,
        default: null
    },
    reporterEmail: {
        type: String,
        required: [true, "You must provide an email for the person submitting the report."]
    },
    facilityName: {
        type: String,
        default: null
    },
    facilityStreetAddress: {
        type: String,
        default: null
    },
    facilityCity: {
        type: String,
        required: [true, "You must provide the facility's city."]
    },
    facilityZIP: {
        type: String,
        default: null
    },
    facilityState: {
        type: String,
        required: [true, "You must provide the facility's state."]
    },
    date: {
        type: String,
        required: [true, "You must provide a date."]
    },
    time: {
        type: String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    wasExplosion: {
        type: Boolean,
        default: null
    },
    wasFire: {
        type: Boolean,
        default: null
    },
    wasFatality: {
        type: Boolean,
        required: [true, "You must specify if there was a death."],
    },
    wasSeriousInjury: {
        type: Boolean,
        required: [true, "You must specify if there was a serious injury."],
    },
    wasSubstantialPropertyDamage: {
        type: Boolean,
        required: [true, "You must specify if there was substantial property damage."],
    },
    chemicals: {
        type: [ChemicalSchema],
        default: null
    },
    totalFatalities: {
        type: Number,
        min: [0, "The number of fatalities must be zero or positive."],
        default: null
    },
    totalSeriousInjuries: {
        type: Number,
        min: [0, "The number of serious injuries must be zero or positive."],
        default: null
    },
    estimatedPropertyDamage: {
        type: Number,
        min: [0, "The estimated property damage must be zero or positive."],
        default: null
    },
    wasEvacuationOrdered: {
        type: Boolean,
        default: null
    },
    totalPeopleEvacuated: {
        type: Number,
        min: [0, "The number evacuated must be zero or positive."],
        default: null
    },
    evacuationRadiusMeteres: {
        type: Number,
        min: [0, "The evacuation radius must be zero or positive."],
        default: null
    },
    wereEmployeesEvacuated: {
        type: Boolean,
        default: null
    },
    wasPublicEvacuated: {
        type: Boolean,
        default: null
    },
    reportURL: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model('Incident', IncidentSchema)