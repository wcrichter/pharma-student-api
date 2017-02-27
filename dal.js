const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:3000/"
const couch_dbname = "pharmacy" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)
const {
    map,
    uniq,
    prop
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


// Does the below line of code need to be here???
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
    doc._id = "pharmacy_" + doc.storeChainName + "_" + doc.storeName + "_" + doc.storeNumber, doc.type = "pharmacy"
    return doc
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
    getUniqueForms: getUniqueForms,
    listMedsByLabel: listMedsByLabel,
    getUniqueIngredients: getUniqueIngredients,
    listMedsByIngredient: listMedsByIngredient,
    listMedsByForm: listMedsByForm,
    getMed: getMed
}

module.exports = dal
