const PouchDB = require('pouchdb-http')
const couch_base_uri = "http://127.0.0.1:5984/"
const couch_dbname = "pharma-student" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)


const patientDesignDocs = [ {
 "_id": "_design/patientsByLastName",
 "views": {
   "patientsByLastName": {
     "map": "function (doc) {\n   if (doc.type === 'patient')\n  emit(doc.lastName, null);\n}"
   }
 },
 "language": "javascript"
},
{
 "_id": "_design/patientsByCondition",
 "views": {
   "patientsByCondition": {
     "map": "function (doc) {\n  if (doc.type === 'patient')\n  doc.conditions.forEach(function(element) {\n    emit(element, null);\n  })\n}\n"
   }
 },
 "language": "javascript"
}
]


db.bulkDocs(patientDesignDocs, function (err, res) {
    if (err) return console.log(err);
    console.log(res)
})
