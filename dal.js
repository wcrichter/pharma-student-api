const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:3000/"
const couch_dbname = "pharmacy" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)
const {
    map,
    uniq,
    prop,
    omit
} = require('ramda')



function getMed(medId, cb) {
    db.get(medId, function(err, doc) {
        if (err) return cb(err)
        cb(null, doc)
    })
}

function getPatient(patientId, cb) {
  db.get(patientId, function(err, patient) {
      if (err) return cb(err)
      cb(null, patient)
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


/////////////// Pharmacy functions /////////////////////
function addPharmacy(doc, cb) {
    checkRequiredInputs(doc) ?
        db.put(preppedNewPharmacy(doc), function(err, addedPharmacy) {
            if (err) return cb(err)
            cb(null, addedPharmacy)
        }) : cb({
            error: "bad_request",
            reason: "bad_request",
            name: "bad_request",
            status: "400",
            message: "need all required inputs..."
        })
}

function updatePharmacy(pharmacy, callMeMaybe) {
    db.put(pharmacy, function(err, doc) {
        if (err) return callMeMaybe(err)
        callMeMaybe(null, doc)
    })
}

function getPharmacy(id, cb) {
    db.get(id, function(err, doc) {
        if (err) return cb(err)
        cb(null, doc)
    })
}

function listPharmaciesByChainName(chain, cb) {
  db.query('pharmaciesByChainName', {include_docs: true, keys: [chain]}, function(err, chain) {
    if (err) return cb(err)
    cb(null, chain.rows)
  })
}

function listPharmaciesByStoreName(storeName, cb) {
  db.query('pharmacyByStoreName', {include_docs: true, keys: [storeName]}, function(err, store) {
    if (err) return cb(err)
    cb(null, store.rows)
  })
}


function deletePharmacy(id, cb) {
  db.get (id, function (err, doc) {
    if (err) return cb(err)

    db.remove(doc, function (err, deletedPharmacy) {
      if (err) return cb(err)
      cb (null, deletedPharmacy)
    })
  })
}

function listPharmacies(cb) {
    db.allDocs({
            include_docs: true,
            startkey: "pharmacy_",
            endkey: "pharmacy_\uffff"
        },
        function(err, list) {
            if (err) return cb(err)
            cb(null, map(x=>x.doc, list.rows))
        })
}

/////////////////// helper functions //////////////////////////
function preppedNewPharmacy(doc) {
  var newId = "pharmacy_" + doc.storeChainName.toLowerCase() + "_" + doc.storeName.toLowerCase() + "_" + doc.storeNumber

  newId = newId.replace(" ", "_")
    doc._id = newId
    doc.type = "pharmacy"
    return doc
}



// function listMedsByForm(form, cb5) {
//     db.query('medsByForm', {
//         include_docs: true,
//         keys: [form]
//     }, function(err, res) {
//         if (err) return cb5(err)
//         cb5(null, map(returnDoc, res.rows))
//     })
// }


// function getUniqueForms(cb6) {
//     db.query('medsByForm', null, function(err, res) {
//         if (err) return cb6(err)
//         cb6(null, uniq(map(row => row.key, res.rows)))
//     })
// }



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


function checkRequiredInputs(doc) {
    return prop('storeNumber', doc) && prop('storeChainName', doc) && prop('storeName', doc) && prop('streetAddress', doc) && prop('phone', doc)
}


const dal = {
    addPharmacy: addPharmacy,
    updatePharmacy: updatePharmacy,
    getPharmacy: getPharmacy,
    listPharmacies: listPharmacies,
    deletePharmacy: deletePharmacy,
    listPharmaciesByChainName: listPharmaciesByChainName,
    listPharmaciesByStoreName: listPharmaciesByStoreName,
    getUniqueForms: getUniqueForms,
    getUniqueConditions: getUniqueConditions,
    listMedsByLabel: listMedsByLabel,
    getUniqueIngredients: getUniqueIngredients,
    listMedsByIngredient: listMedsByIngredient,
    listMedsByForm: listMedsByForm,
    getMed: getMed,
    addPatient: addPatient,
    getPatients: getPatients,
    listPatientsByLastName: listPatientsByLastName,
    listPatientsByCondition: listPatientsByCondition,
    updatePatient: updatePatient,
    deletePatient: deletePatient,
    getPatient: getPatient
}

module.exports = dal
