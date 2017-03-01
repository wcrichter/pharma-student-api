const PouchDB = require('pouchdb-http')
PouchDB.plugin(require('pouchdb-mapreduce'))
const couch_base_uri = "http://127.0.0.1:5984/"
const couch_dbname = "pharma-student" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)
const {
    map,
    uniq,
    prop,
    omit
} = require('ramda')


function bulkAddPatients(patients, cb) {
  db.bulkDocs(patients, function (err, res) {
      if (err) return cb(err)
      cb(null, res)
  })
}

const patients = [ {
  "_id": "patient_freeman_brenda_3066_6453927",
  "type": "patient",
  "patientNumber": 6453927,
  "firstName": "Brenda",
  "lastName": "Freeman",
  "birthdate": "1997-09-02",
  "gender": "F",
  "ethnicity": "W",
  "last4SSN": 3066,
  "conditions": [
    "Depression",
    "Asthma"
  ]
},
{
  "_id": "patient_martin_diana_8039_7231651",
  "type": "patient",
  "patientNumber": 7231651,
  "firstName": "Diana",
  "lastName": "Martin",
  "birthdate": "1966-05-30",
  "gender": "F",
  "ethnicity": "W",
  "last4SSN": 8039,
  "conditions": [
    "Hypertension"
  ]
}
]

bulkAddPatients(patients, function(err, res) {
  if (err) return console.log(err)
  console.log(res)
})
