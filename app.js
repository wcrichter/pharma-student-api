const express = require('express')
const app = express()
const {
    getUniqueForms,
    listMedsByLabel,
    getUniqueIngredients,
    listMedsByIngredient,
    listMedsByForm,
    getMed
} = require('./dal.js')
const {
    split
} = require('ramda')
const HTTPError = require('node-http-error')
const port = process.env.PORT || 8080

app.get('/medications', function(req, res, next) {
    if (req.query.filter && split(':', req.query.filter)[0] === 'ingredient') {
        const result = split(':', req.query.filter)
        listMedsByIngredient(result[1], function(err, meds) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(meds)
        })
    } else if (!req.query.filter) {
        listMedsByLabel(function(err, meds) {
            if (err) return next(new HTTPError(err.status, err.message, err))
            res.status(200).send(meds)
        })
    } else {
      res.status(200).send([])
    }
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
