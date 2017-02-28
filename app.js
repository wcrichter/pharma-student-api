const express = require('express')
const app = express()
const { getUniqueForms, listMedsByLabel, getUniqueIngredients, listMedsByIngredient,
        listMedsByForm, getMed, updatePharmacy, addPharmacy, getPharmacy, listPharmacies, deletePharmacy,
        addPatient, getPatients, listPatientsByLastName, getUniqueConditions, listPatientsByCondition,
        updatePatient, deletePatient, getPatient} = require('./dal.js')
const { split } = require('ramda')
const bodyParser = require('body-parser')
const HTTPError = require('node-http-error')
const port = process.env.PORT || 8082

app.use(bodyParser.json())

app.get('/medications', function(req, res, next) {
    if (req.query.filter && split(':', req.query.filter)[0].toLowerCase() === 'ingredient') {
        const result = split(':', req.query.filter)
        listMedsByIngredient(result[1], function(err, meds) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(meds)
        })
    } else if (req.query.filter && split(':', req.query.filter)[0].toLowerCase() === 'form') {
        const result = split(':', req.query.filter)
        listMedsByForm(result[1], function(err, meds) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(meds)
        })
    } else if (!req.query.filter) {
        const startkey = req.query.startkey ? req.query.startkey : undefined
        const limit = req.query.limit ? req.query.limit : undefined
        listMedsByLabel(startkey, limit, function(err, meds) {
            console.log(startkey + " " + limit) //working...
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(meds)
          })
    } else {
        res.status(200).send([])
    }
})


app.get('/medications/ingredients', function(req, res, next) {
    getUniqueIngredients(function(err, ingredients) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(200).send(ingredients)
    })
})

app.get('/medications/forms', function(req, res, next) {
    getUniqueForms(function(err, forms) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(200).send(forms)
    })
})

//////PATIENTS//////

//Post/Add a patient
app.post('/patients', function(req, res, next) {
    console.log(req.body)
    addPatient(req.body, function(err, dalResponse) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.send(dalResponse)
    })
})


app.get('/patients', function(req, res, next) {
    if (req.query.filter && split(':', req.query.filter)[0].toLowerCase() === 'lastname') {
        const result = split(':', req.query.filter)
        listPatientsByLastName(result[1], function(err, patient) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(patient)
        })
    } else if (req.query.filter && split(':', req.query.filter)[0].toLowerCase() === 'condition') {
        const result = split(':', req.query.filter)
        listPatientsByCondition(result[1], function(err, patient) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(patient)
        })
    } else if (!req.query.filter) {
        getPatients(function(err, patients) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(patients)
        })
    } else {
        return res.status(200).send([])
    }
})

app.get('/patients/conditions', function(req, res, next) {
    getUniqueConditions(function(err, conditions) {
        if (err) return next(new HTTPError(err.status, err.message, err))
        res.status(200).send(conditions)
    })
})

app.put('/patients/:id', function (req, res, next) {
  console.log(req.body)
  updatePatient(req.body, function (err, dalResponse) {
    if (err) return next(new HTTPError(err.status, err.messsge, err))
    res.send(dalResponse)
  })
})

app.get('/patients/:id', function (req, res, next) {
  getPatient(req.params.id, function (err, resp) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.send(resp)
  })
})

app.delete('/patients/:id', function (req, res, next) {
  deletePatient(req.params.id, function (err, person) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.send(person)

  })
})


/////////////// Pharmacy functions /////////////////////
app.put('/pharmacies/:id', function(req, res, next) {
  updatePharmacy(req.body, function(err, pharmacy) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(pharmacy)
  })
})

app.post('/pharmacies', function (req, res, next) {
  addPharmacy(req.body, function (err, docs) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(201).send(docs)
  })
})

app.get('/pharmacies/:id', function(req, res, next) {
  getPharmacy(req.params.id, function(err, returnedPharmacy) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(returnedPharmacy)
  })
})

app.get('/pharmacies', function(req, res, next) {

  const limit = req.query.limit ? req.query.limit : 10
  const startKey = req.query.startkey ? req.query.startkey : undefined

  listPharmacies(startKey , limit, function(err, pharmacyList) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(pharmacyList)
  })
})


app.delete('/pharmacies/:id', function (req, res, next) {
  deletePharmacy(req.params.id, function (err, doc) {
    if (err) return next(new HTTPError(err.status, err.message, err))
    res.status(200).send(doc)
  })
})


///////////// error handler /////////////////////////////
app.use(function(err, req, res, next) {
    console.log(req.method, " ", req.path, "error:  ", err)
    res.status(err.status || 500)
    res.send(err)
})

app.listen(port, function() {
    console.log("I'm listening on port ", port)
})
