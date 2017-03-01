const PouchDB = require('pouchdb-http')
const couch_base_uri = "http://127.0.0.1:3000/"
const couch_dbname = "pharmacy-delete" //remember pharmacy for me
const db = new PouchDB(couch_base_uri + couch_dbname)


const medDocs = [
  {
  "label": "Amlodipine 10mg tablet",
  "ingredients": [
    "Amlodipine",
    "Aspirin"
  ],
  "amount": "10",
  "unit": "mg",
  "form": "tablet"
},

{
"label": "Amlodipine 200mg syrup",
"ingredients": [
  "Amlodipine",
  "Aspirin"
],
"amount": "200",
"unit": "mg",
"form": "syrup"
},

{
  "label": "Spironolactone 100mg patch",
  "ingredients": [
    "spironolactone",
    "tamezipam"
  ],
  "amount": "100",
  "unit": "mg",
  "form": "patch",
  "type": "medication"
},


  {
  "_id": "_design/medsByForm",

  "views": {
    "medsByForm": {
      "map": "function (doc) {\n  if (doc.type ===\"medication\") {\n      emit(doc.form, null);\n  }\n}"
    }
  },
  "language": "javascript"
},
{
  "_id": "_design/medsByIngredient",
  "views": {
    "medsByIngredient": {
      "map": "function (doc) {\n  if (doc.type ===\"medication\") {\n    doc.ingredients.forEach(function(ingredientName) {\n      emit(ingredientName,null);\n    })\n  }\n}"
    }
  },
  "language": "javascript"
},
{
  "_id": "_design/medsByLabel",
  "views": {
    "medsByLabel": {
      "map": "function (doc) {\n  if (doc.type ===\"medication\") {\n     emit(doc.label,null);\n  }\n \n}"
    }
  },
  "language": "javascript"
},

]


db.bulkDocs(medDocs, function (err, res) {
    if (err) return console.log(err);
    console.log(res)
})
