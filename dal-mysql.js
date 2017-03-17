const mysql = require('mysql');

const {
    map,
    filter,
    uniq,
    prop,
    omit,
    compose,
    drop,
    path,
    pathOr,
    view,
    lensIndex,
    set,
    lensPath,
    toString,
    lensProp
} = require('ramda')

const moment = require('moment')

var dal = {
    getMed: getMed,
    getPharmacy: getPharmacy,
    getPatient: getPatient,
    getPatients: getPatients,
    listMedsByLabel: listMedsByLabel
}

module.exports = dal

/////////////////////
//   medications
/////////////////////
function getMed(medId, cb) {
    // getDocByID('medWithIngredients', id, formatMed, function(err, res) {
    //     if (err) return callback(err)
    //     //callback(null, view(lensIndex(0), res))
    //     callback(null, res)
    // })
    if (!medId) return cb({
        error: 'missing_id',
        reason: 'missing_id',
        name: 'missing_id',
        status: 400,
        message: 'unable to retrieve medication due to missing id.'
    })

    const connection = createConnection()

    connection.query('SELECT * FROM medWithIngredients WHERE ID = ?', [medId], function(err, data) {
        if (err) return cb({
            error: 'unknown',
            reason: 'unknown',
            name: 'unknown',
            status: 500,
            message: err.message
        })
        if (data.length === 0) return cb({
            error: 'not_found',
            reason: 'missing',
            name: 'not_found',
            status: 404,
            message: 'You have attempted to retrieve a medication that is not in the database or has been deleted.'
        })

        // const mappedIngredients = compose(
        //     map(med => med.ingredient),
        //     filter(med => med.ingredient)
        // )(data)
        //
        // const theResult = compose(
        //   omit(['ID', 'ingredient']),
        //   set(lensProp('ingredients'), mappedIngredients),
        //   set(lensProp('_id'), toString(prop('ID', data[0]))),
        //   set(lensProp('_rev'), ""),
        //   set(lensProp('type'), "medication")
        // )(data[0])

        cb(null, formatSingleMed(data))
    })
}

function formatSingleMed(medRows) {
  const mappedIngredients = compose(
      map(med => med.ingredient),
      filter(med => med.ingredient)
  )(medRows)

  return compose(
    omit(['ID', 'ingredient']),
    set(lensProp('ingredients'), mappedIngredients),
    set(lensProp('_id'), toString(prop('ID', medRows[0]))),
    set(lensProp('_rev'), ""),
    set(lensProp('type'), "medication")
  )(medRows[0])
}


function listMedsByLabel(startKey, limit, cb) {
  const connection = createConnection()

  limit = limit ? limit : 4
  const whereClaus = startKey ? " WHERE concat(m.label, m.ID) > '" + startKey + "'": ''

  let sql = 'SELECT m.*, concat(m.label, m.ID) as startKey '
  sql += ' FROM medWithIngredients m '
  sql += ' INNER JOIN (SELECT DISTINCT ID '
  sql += ' FROM medWithIngredients m '
  sql += whereClaus
  sql += ' LIMIT ' + limit + ') b'
  sql += ' ON m.ID = b.ID '
  sql += whereClaus
  sql += ' ORDER BY startKey '

  console.log('sql: ', sql)

  connection.query(sql, function(err, data) {
    if (err) return cb({
        error: 'unknown',
        reason: 'unknown',
        name: 'unknown',
        status: 500,
        message: err.message
    })
    if (data.length === 0) return cb({
        error: 'not_found',
        reason: 'missing',
        name: 'not_found',
        status: 404,
        message: 'missing'
    })
    cb(null, formatMultipleMeds(data))
  })
}

function formatMultipleMeds(meds) {
  const IDs = compose(
    uniq(),
    map(med => med.ID)
  )(meds)

  return map(id => compose(
            formatSingleMed,
            filter(med => med.ID === id)
            )(meds))(IDs)

}


function getPatient(patientID, cb) {
    if (!patientID) return cb({
        error: 'missing_id',
        reason: 'missing_id',
        name: 'missing_id',
        status: 400,
        message: 'unable to retrieve patient due to missing id.'
    })

    const connection = createConnection()

    connection.query('SELECT * FROM patientWithConditions WHERE ID = ?', [patientID], function(err, data) {
      if (err) return cb({
          error: 'unknown',
          reason: 'unknown',
          name: 'unknown',
          status: 500,
          message: err.message
      })
      if (data.length === 0) return cb({
          error: 'not_found',
          reason: 'missing',
          name: 'not_found',
          status: 404,
          message: 'missing'
      })

      cb(null, formatSinglePatient(data))

    })
}

// const whereClaus = startKey ? " WHERE concat(m.label, m.ID) > '" + startKey + "'": ''
//
// let sql = 'SELECT m.*, concat(m.label, m.ID) as startKey '
// sql += ' FROM medWithIngredients m '
// sql += ' INNER JOIN (SELECT DISTINCT ID '
// sql += ' FROM medWithIngredients m '
// sql += whereClaus
// sql += ' LIMIT ' + limit + ') b'
// sql += ' ON m.ID = b.ID '
// sql += whereClaus
// sql += ' ORDER BY startKey '



function getPatients(startKey, limit, cb) {

   const connection = createConnection()

   limit = limit ? limit : 3
   const whereClaus = startKey ? " WHERE concat(p.lastName, p.ID) > '" + startKey + "'": ''

   let sql = 'SELECT p.*, concat(p.lastName, p.ID) as startKey '
   sql += ' FROM patientWithConditions p '
   sql += ' INNER JOIN (SELECT DISTINCT ID '
   sql += ' FROM patientWithConditions p '
   sql += whereClaus
   sql += ' LIMIT ' + limit + ') b'
   sql += ' ON p.ID = b.ID '
   sql += whereClaus
   sql += ' ORDER BY startKey '

   connection.query(sql, function(err, data) {
      if (err) return cb(errorMessage)
      if (data.length === 0) return cb(noDataFound)
      cb(null, formatMultiplePatients(data))
    })

}

function formatMultiplePatients(patients) {

    const IDs = compose(
      uniq(),
      map(patient => patient.ID)
    )(patients)

    return map(id => compose(
      formatSinglePatient,
      filter(patient => patient.ID === id)
    )(patients))(IDs)

}

function formatSinglePatient(patientRows) {

  const mappedConditions = compose(
    map(patient => patient.condition),
    filter(patient => patient.condition)
  )(patientRows)

  return  compose(
    set(lensProp('birthdate'), moment(prop('birthdate', patientRows[0])).format("YYYY-MM-DD")),
    set(lensProp('conditions') , mappedConditions),
    omit(['ID', 'condition']),
    set(lensProp('_id'), toString(prop('ID', patientRows[0]))),
    set(lensProp('_rev'), ""),
    set(lensProp('type'), "patient")
  )(patientRows[0])
}


///pharmacy

function getPharmacy(pharmacyId, cb) {
    if (!pharmacyId) return cb({
        error: 'missing_id',
        reason: 'missing_id',
        name: 'missing_id',
        status: 400,
        message: 'unable to retrieve data due to missing id.'
    })

    const connection = createConnection()

    connection.query('SELECT * FROM pharmacy WHERE ID = ?', [pharmacyId], function(err, data) {
        if (err) return cb({
            error: 'unknown',
            reason: 'unknown',
            name: 'unknown',
            status: 500,
            message: err.message
        })
        if (data.length === 0) return cb({
            error: 'not_found',
            reason: 'missing',
            name: 'not_found',
            status: 404,
            message: 'missing'
        })

        console.log('success:', data)

        const typeLens = lensProp('type')
        const revLens = lensProp('_rev')
        const idLens = lensProp('_id')

        let idValue = prop('ID', data[0])
        idValue = toString(idValue)

        const theResult = compose(
            omit('ID'),
            set(idLens, idValue),
            set(revLens, ''),
            set(typeLens, 'pharmacy')
        )(data[0])

        cb(null, theResult)

    })
}

/////////////////////
// helper functions
/////////////////////

function notFound() {
  return {
      error: 'missing_id',
      reason: 'missing_id',
      name: 'missing_id',
      status: 400,
      message: 'unable to retrieve data due to missing id.'
  }
}

function errorMessage() {
  return {
      error: 'unknown',
      reason: 'unknown',
      name: 'unknown',
      status: 500,
      message: err.message
  }
}

function noDataFound() {
  return {
      error: 'not_found',
      reason: 'missing',
      name: 'not_found',
      status: 404,
      message: 'missing'
  }
}

function createConnection() {
    return mysql.createConnection({
        host: "0.0.0.0",
        user: "root",
        password: "topher",
        database: "pharmaStudent"
    });
}


function getDocByID(tablename, id, formatter, callback) {
    //  console.log("getDocByID", tablename, id)
    if (!id) return callback({
        error: 'missing_id',
        reason: 'missing_id',
        name: 'missing_id',
        status: 400,
        message: 'unable to retrieve data due to missing id.'
    })

    var connection = createConnection()

    connection.query('SELECT * FROM ' + connection.escapeId(tablename) + ' WHERE id = ?', [id], function(err, data) {
        if (err) return callback({
            error: 'unknown',
            reason: 'unknown',
            name: 'unknown',
            status: 500,
            message: err.message
        })
        if (data.length === 0) return callback({
            error: 'not_found',
            reason: 'missing',
            name: 'not_found',
            status: 404,
            message: 'missing'
        });

        if (data) {
            //console.log("query returned with data", formatter, formatter(data[0]))
            // grab the item sub [0] from the data.
            // take the data and run it through the formatter (convertPersonNoSQLFormat)
            // then take result of converting the person and parseToJSON
            return callback(null, formatter(data))
        }
    });
    connection.end(function(err) {
        if (err) return err;
    });
}

// function formatMed() {
//     return compose(
//         addMedType,
//         convertNoSQLFormat
//     )
// }

function formatMed(meds) {
  // db view returns repeated meds when multiple ingredients.
  // First, return a single med by grabbing the first med in the array.
  //  Then, format the med to make it look like a couchdb doc.

    return compose(
        addMedType,
        convertNoSQLFormat
    )(view(lensIndex(0), meds))

    //console.log("Meds from mysql",)

    //
    // const formattedMed = compose(
    //     addMedType,
    //     convertNoSQLFormat
    // )(view(lensIndex(0), meds))
    //
    // // create an array of ingredients from the db view rows
    // const ingredients = compose(
    //     filter(med => med !== null),
    //     map(med => path(['ingredient'], med))
    // )(meds)
    //
    // // set a new ingredient property with the array of ingredients
    // //  before returning the formatted med.
    // return set(lensPath(['ingredient']), ingredients, formattedMed );
}

const addMedType = med => set(lensPath(['type']), 'medication', med)

const convertNoSQLFormat = row => compose(
      omit(['ID']),
      set(lensPath(['_id']), path(['ID'], row))
    )(row)
