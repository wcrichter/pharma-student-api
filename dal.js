const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:3000/"
const couch_dbname = "pharmacy-new" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)
const {
    map,
    uniq,
    omit
} = require('ramda')


function getMed(medId, cb1) {
    // go to couch and get the med using db.get()
    // return the document back to the caller of the getMed().
    //   The caller will pass in a callback (cb).
    db.get(medId, function(err, doc) {
        if (err) return cb1(err)
        cb1(null, doc)
    })
}

function getPatient(patientId, cb) {
  db.get(patientId, function(err, patient) {
      if (err) return cb(err)
      cb(null, patient)
  })
}

// listMedsByLabel() - alpha sort by label - call pouchdb's api: db.query('medsByLabel', {options}, cb)

function listMedsByLabel(cb2) {
    db.query('medsByLabel', {
        include_docs: true
    }, function(err, res) {
        if (err) return cb2(err)
        cb2(null, map(returnDoc, res.rows))
    })
}

// listMedsByIngredient() - sort by ingredient - call pouchdb's api:  db.query('medsByIngredient', {options}, cb)
function listMedsByIngredient(ingredient, cb3) {
    db.query('medsByIngredient', {
        include_docs: true,
        keys: [ingredient]
    }, function(err, res) {
        if (err) return cb3(err)
        cb3(null, map(returnDoc, res.rows))
    })
}

function getUniqueIngredients(cb4) {
    db.query('medsByIngredient', null, function(err, res) {
        if (err) return cb4(err)
        cb4(null, uniq(map(row => row.key, res.rows)))
    })
}

function listMedsByForm(form, cb5) {
    db.query('medsByForm', {
        include_docs: true,
        keys: [form]
    }, function(err, res) {
        if (err) return cb5(err)
        cb5(null, map(returnDoc, res.rows))
    })
}


function getUniqueForms(cb6) {
    db.query('medsByForm', null, function(err, res) {
        if (err) return cb6(err)
        cb6(null, uniq(map(row => row.key, res.rows)))
    })
}

const returnDoc = row => row.doc


////////PATIENTS////////

function addPatient(patient, cb7) {

    patient._id = `patient_${patient.lastName.toLowerCase()}_${patient.firstName.toLowerCase()}_${patient.last4SSN}_${patient.patientNumber}`
    db.put(patient, function(err, res) {
        if (err) return cb7(err)
        cb7(null, res)
    })
}


function getPatients(cb8) {
    db.allDocs({
        include_docs: true,
        start_key: "patient_",
        end_key: "patient_\uffff"
    }, function(err, res) {
        if (err) return cb8(err)
        cb8(null, (map(obj => omit("type", obj.doc), res.rows)))
    })
}


function listPatientsByLastName(lastName, cb9) {
    db.query('patientsByLastName', {
        include_docs: true,
        keys: [lastName]
    }, function(err, res) {
        if (err) return cb9(err)
        cb9(null, map(returnDoc, res.rows))
    })
}

function listPatientsByCondition(condition, cb14) {
    db.query('patientsByCondition', {
        include_docs: true,
        keys: [condition]
    }, function(err, res) {
        if (err) return cb14(err)
        cb14(null, map(returnDoc, res.rows))
    })
}

function getUniqueConditions(cb12) {
    db.query('patientsByCondition', null, function(err, res) {
        if (err) return cb12(err)
        cb12(null, uniq(map(row => row.key, res.rows)))
    })
}

function updatePatient (patient, cb) {
  patient.type = "patient"
  db.put(patient, function (err, res) {
    if (err) return cb(err)
    cb(null, res)
  })
}

function deletePatient (id, cb) {
  db.get(id, function (err, doc) {
    if (err) return cb(err)
    db.remove(doc, function (err, removedDoc) {
    if (err) return cb(err)
    cb(null, removedDoc)
  })
})
}

function getPatient(patientId, cb) {
  db.get(patientId, function(err, patient) {
      if (err) return cb(err)
      cb(null, patient)
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
    addPatient: addPatient,
    getPatients: getPatients,
    listPatientsByLastName: listPatientsByLastName,
    getUniqueConditions: getUniqueConditions,
    listPatientsByCondition: listPatientsByCondition,
    updatePatient: updatePatient,
    deletePatient: deletePatient,
    getPatient: getPatient
}

module.exports = dal