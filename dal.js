const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:3000/"
const couch_dbname = "pharmacy-new" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)
const {
    map,
    uniq
} = require('ramda')


function getMed(medId, cb) {
    // go to couch and get the med using db.get()
    // return the document back to the caller of the getMed().
    //   The caller will pass in a callback (cb).
    db.get(medId, function(err, doc) {
        if (err) return cb(err)
        cb(null, doc)
    })
}

// listMedsByLabel() - alpha sort by label - call pouchdb's api: db.query('medsByLabel', {options}, cb)

function listMedsByLabel(cb) {
    db.query('medsByLabel', {
        include_docs: true
    }, function(err, res) {
        if (err) return cb(err)
        cb(null, map(returnDoc, res.rows))
    })
}

// listMedsByIngredient() - sort by ingredient - call pouchdb's api:  db.query('medsByIngredient', {options}, cb)
function listMedsByIngredient(ingredient, cb) {
    db.query('medsByIngredient', {
        include_docs: true,
        keys: [ingredient]
    }, function(err, res) {
        if (err) return cb(err)
        cb(null, map(returnDoc, res.rows))
    })
}

function getUniqueIngredients(cb) {
    db.query('medsByIngredient', null, function(err, res) {
        if (err) return cb(err)
        cb(null, uniq(map(row => row.key, res.rows)))
    })
}

function listMedsByForm(form, cb) {
    db.query('medsByForm', {
        include_docs: true,
        keys: [form]
    }, function(err, res) {
        if (err) return cb(err)
        cb(null, map(returnDoc, res.rows))
    })
}

function getUniqueForms(cb) {
    db.query('medsByForm', null, function(err, res) {
        if (err) return cb(err)
        cb(null, uniq(map(row => row.key, res.rows)))
    })
}

const returnDoc = row => row.doc

function addPatient(patient, cb) {

    patient._id = `patient_${patient.lastName.toLowerCase()}_${patient.firstName.toLowerCase()}_${patient.last4SSN}_${patient.patientNumber}`
    db.put(patient, function(err, res) {
        if (err) return cb(err)
        cb(null, res)
    })
}


// getUniqueForms(function(err, forms) {
//   if (err) return console.log(err)
//   console.log(forms)
// })

const dal = {
    getUniqueForms: getUniqueForms,
    listMedsByLabel: listMedsByLabel,
    getUniqueIngredients: getUniqueIngredients,
    listMedsByIngredient: listMedsByIngredient,
    listMedsByForm: listMedsByForm,
    getMed: getMed,
    addPatient: addPatient
}

module.exports = dal