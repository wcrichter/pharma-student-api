# Pharmacy API

## Medications

## `GET /medications`

Returns a collection of medications default sorted by label.  You may optionally filter the medications by ingredient or form, such as patch, tablet, syrup. Attempting any other filter will result in an `200` response code with an empty array returned.

**Request URL**

```
http://localhost:8080/medications
```

**Examples**

Get medications that contain the ingredient Aspirin.

```
$ curl -X GET http://localhost:8080/medications?filter=ingredient:Aspirin
```

**Query Parameters**

<table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Required</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>filter</td>
          <td>false</td>
          <td>string</td>
          <td>Filters a collection of medications by specified ingredient or form, such as, (tablet, syrup, patch).
          <ul>
          <li>Filter By ingredient example:  GET /medications?filter=ingredient:aspirin.</li>
          <li>Filter by form example: GET /medications?filter=form:tablet.</li>
          </ul>
          </td>
        </tr>
      </tbody>
    </table>

**Response `200`**

```
[
    {
        "_id": "medication_amlodipine_10mg_tablet",
        "_rev": "3-f071655fdafe4bd3d8cbbc22b11dacd0",
        "label": "Amlodipine 10mg tablet",
        "ingredients": [
            "Amlodipine",
            "Aspirin"
        ],
        "amount": "10",
        "unit": "mg",
        "form": "tablet",
        "type": "medication"
    },
    {
        "_id": "medication_spironolactone_100mg_tablet",
        "_rev": "3-01ca16f7eaede703edac68d60d6c0333",
        "label": "Lisinopril 100mg tablet",
        "ingredients": [
            "spironolactone",
            "tamezipam"
        ],
        "amount": "100",
        "unit": "mg",
        "form": "tablet",
        "type": "medication"
    },
    {
        "_id": "medication_lisinopril_20mg_tablet",
        "_rev": "5-28bab875b5388b6e99627b347c88e668",
        "label": "Lisinopril 20mg tablet",
        "ingredients": [
            "Lisinopril"
        ],
        "amount": "20",
        "unit": "mg",
        "form": "tablet",
        "type": "medication"
    },
    ...
]
```

**Response `404`**

Returned when the specified action is not found.

```
Cannot GET /medicat?filter=ingredient:Aspirin
```




## `GET /medications/{medicationId}`

Return a medication for a given medication id.

**Request URL**

```
http://localhost:8080/medications/{medicationId}
```

**Examples**

Get a medication

```
$ curl -X GET -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 4c096411-c83d-98b5-dcf3-1bab3a02363b" "http://localhost:8080/medications/medication_nyquil_200%20ml%20syrup_syrup"
```

**Request Parameters**

<table class="table table-striped table-hover">
      <thead>
        <tr>
          <th>Parameter</th>
          <th>Required</th>
          <th>Type</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>medicationId</td>
          <td>true</td>
          <td>string</td>
          <td>Unique identifier for a medication.
          </td>
        </tr>
      </tbody>
    </table>


**Response `200`**

```
{
    "_id": "medication_nyquil_200 ml syrup_syrup",
    "_rev": "1-dc27efb54edd17daa58b52d30990d071",
    "label": "Nyquil 200 ml syrup",
    "ingredients": [
        "Ibuprofin"
    ],
    "amount": "200",
    "unit": "ml",
    "form": "syrup",
    "type": "medication"
}
```

## `POST /medications`

Adds a medication the collection of medications.  

**Request URL**

```
http://localhost:8080/medications
```

**Examples**

Creates a medication by providing a new medication as JSON in the request body:

```
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 62e6431c-c7e5-b197-c12b-394f4d73d27e" -d '{
    "label": "Amlodipine 200mg syrup",
    "ingredients": [
      "Amlodipine",
      "Aspirin"
    ],
    "amount": "200",
    "unit": "mg",
    "form": "syrup",
    "type": "medication"
  }' "http://localhost:8080/medications"
```

**Response `201`**

```
{
  "ok": true,
  "id": "medication_amlodipine_200mg_syrup",
  "rev": "1-4efe163301bb197b58f837b931558f9d"
}
```

**Response `409`**

```
{
  "name": "conflict",
  "status": 409,
  "message": "Document update conflict.",
  "reason": "Document update conflict.",
  "error": "conflict"
}
```



## `POST /pharmacies`

**Examples**

Creates a pharmacy by providing a new pharmacy as JSON in the request body:

```
curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 484fbe93-d990-428d-8942-ba247b4ce09d" -d '{
    "type": "pharmacy",
    "storeNumber": "1004",
    "storeChainName": "Walgreens",
    "storeName": "Hwy 17 S. Myrtle Beach",
    "streetAddress": "250 South Myrtle Beach Market Road",
    "phone": "843-777-1111",
    "city": "Myrtle Beach",
    "state": "SC",
    "zip": "29345"
  }' "http://localhost:8080/pharmacies"
```

**Response `201`**

```
{
  "ok": true,
  "id": "pharmacy_Walgreens_Hwy_17_S._Myrtle_Beach_1004",
  "rev": "1-303c4dd05db46df6680146b971113328"
}
```

## `POST /patients`


**Examples**

Creates a patient by providing a new patient as JSON in the request body:

```
$ curl -X POST -H "Content-Type: application/json" -H "Cache-Control: no-cache" -H "Postman-Token: 0d5cbbeb-a77d-482c-e20b-fa18f159c52d" -d '{
    "patientNumber": 1001,
    "firstName": "Steve",
    "lastName": "Austin",
    "birthdate": "1940-09-01",
    "gender": "M",
    "ethnicity": "W",
    "last4SSN": 3033,
    "conditions": [
      "Depression",
      "Hypertension"
    ]
  }' "http://localhost:8080/patients"

```

**Response `201`**

```
{
  "ok": true,
  "id": "patient_austin_steve_3033_1001",
  "rev": "1-252282dad5d90055fdd2ff1667d5f666"
}
```

## Use Cases

### List Medications

As a doctor, I would like the ability to view a list of medications (alpha sort by label and sort by ingredient) and select a single medication so that I can view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

A medication contains the following information:

- label (string) Ex: Aspirin 100mg tablet
- ingredients (array of strings) Ex: ["Aspirin"]
- amount (number) Ex: 100
- unit (string) Ex: "mg"
- form (string) Ex: "tablet"

### List Ingredients and Filter Meds By Ingredients

As a doctor, I would like the ability to view a unique list of ingredients used in all our medications. After selecting an ingredient from the list, provide a filtered list of medications that contain the selected ingredient.  After selecting a single medication, I want to view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

### List forms and filter meds by form

As a doctor, I would like the ability to view a unique list of medication forms (syrup, tablet, patch...) used in all our medications. After selecting an form from the list, provide a filtered list of medications that contain the selected form.  After selecting a single medication, I want to view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

### User Story 4 - Manage Patients (CHANGE)

As an medical assistant or RN within the doctor's office, I need the ability to manage basic patient demographic information and conditions.  Include add (done), read (done), edit (done), delete (done).:

- `id`: "patient <last> <first> <last4> <patientNumber>"
- type: "patient"
- patientNumber Ex: "1239484"
- firstName Ex: "Gomez"
- lastName "Adams"
- birthDate: "1995-02-27T14:30Z"  "ISO DATE Format"  
  - https://www.w3schools.com/jsref/jsref_toisostring.asp
  - https://en.wikipedia.org/wiki/ISO_8601
- gender "M",
- ethnicity "H".  Valid ethnicity codes include ("W - White, AA - African American, H - Hispanic, NA - Native American/ Pacific Islander")
- last4SSN  "6664",
- conditions: Ex:  [
    "Anxiety",
    "Hypertension",
    "Hyperthyroid"
  ]

## Research ISO Dates

 - 0) Research

### Database

  - 1) Model patient record

### dal

  - 2) create a function to add a person into the database
  - 5) create dal functions to support read, update and delete.

### API

  - 3) Create the endpoint to enable adding of a person to the database
  - 4) Call the endpoint to add (POST) people into the database
  - 5) Create endpoints to support read (GET), update (PUT) and delete (DELETE).

## User Story 5 - Search Patients By Last Name (done)

As a medical professional or pharmacist, I desire the ability to search for patients by last name so that I can view basic a patient's demographic and medical conditions.

* Related to this user story's request we realized we wanted functionality to get a patient by their unique id. (done)

### DAL

- `getPatients()`
- `getPatientsByLastName()` - search by last name - create a function to utilize `db.allDocs()` with the following options:
  - `include_docs: true`
  - `start_key: "patient_<lastName>"`
  - `end_key: "patient_<lastName>/uffff"`

### API

- `GET /patients?filter=lastname:smith`.  

  ```
  app.get('/patients', fn(req, res, next){

    // TODO: see if filter is provided in query string.
    req.query.filter...


  })
  ```
## User Story 6 - Search Patients By Conditions (Done)

As a medical professional or pharmacist, I desire the ability to search for patients by conditions so that I can view basic a patient's demographic and medical conditions.  I want to pick from a unique list of all patient conditions in the database.  Once a condition is selected, I want to view all patients with the related condition.  

## User Story 7 - Manage Pharmacies

As a medical assistant, I need the ability to maintain a list of pharmacies so that doctors can prescribe medications to patients.  I need the ability to manage the following information:

  - id - "pharmacy_storeChainName_storeName_storeNumber"
  - type: "pharmacy"
  - storeNumber- "1001"
  - storeChainName -  "CVS"
  - storeName - "Belle Hall"
  - streetAddress - "2000 Belle Hall Lane"
  - phone
  - city - "Mount Pleasant"
  - state - "SC"
  - zipCode - "29464"

### Database

  - 1) (Done) Model pharmacy record (JSON)

### DAL

  - (Done) create - a function to add a pharmacy:  `addPharmacy(pharmacy, cb)`
    - create custom id; `pharmacy_walgreens_king_street_1005`
  - (Done) read                                     
  - (Done) update
  - (Suzanne) delete    `deletePharmacy`    'pharmacies/:id', cb
  - (Chris) list        `listPharmacies`    'pharmacies'

### API

 - (Done) create endpoint to call dal addPharmacy '/pharmacies'
 - (Done) read endpoint to call dal...              '/pharmacies/:id'  <= <pharmacy id>
 - (Done) update endpoint to call dal...          '/pharmacies/:id'  <= <pharmacy id>
 - (Suzanne) delete endpoint to call dal...                    '/pharmacies/:id'  <= <pharmacy id>
 - (Chris) list endpoint to call dal...                      '/pharmacies?'

## User Story 8 - Search Pharmacies

  - As a medical assistant, I need the ability to search for pharmacies by chain name or store name when prescribing medications.  

### Database

- search by chainName can utilize allDocs and primary id
- (Stephen) create query to search by storeName

### DAL

- search listPharmaciesByChainName(chainName, cb)
- search listPharmaciesByStoreName(storeName, cb)

### API

- list      `GET /pharmacies?filter=chainName:cvs`
- list      `GET /pharmacies?filter=storeName:belle+hall`


## User Story 9 - Manage Patient Prescriptions

As a doctor, I need the ability to write a prescription to a patient for one or more medications.  When adding or editing a prescription I will:

  - Search and select a patient
  - Search, select, and add one or more medications
  - Search and select the desired pharmacy.
  - Complete the prescription by marking the `readyForPharmacy` property to `true`.

When adding a medication, I will provide the frequency for the medication by selecting a frequency from a list of unique frequencies:  

```
{
  "_id": "script_patient_washington_robert_7064_4277172_2017-2-04T12:35:00.000Z",
  "type": "script",
  "patientID": "patient_washington_robert_7064_4277172",
  "pharmacyID": "pharmacy_cvs_belle_hall_1001",
  "prescriptionDate": "2017-2-04T12:35:00.000Z"
  "readyForPharmacy": true
  "meds": [
    {
      "medication_id": "medication_aspirin_200mg_tablet",
      "frequency": "daily"
    },
    {
      "medication_id": "medication_amlodipine_20mg_syrup",
      "frequency": "4x daily"
    }
  ]
```


## User Story 10 - Search Prescriptions

As a pharmacist, I need the ability to search prescriptions assigned to my pharmacy and that are ready to be fulfilled (`readyForPharmacy === true`).  Once I select a prescription, I need to view the various medications listed within the prescription, so I can fill them.

```
{
  "_id": "script_patient_washington_robert_7064_4277172_2017-2-04T12:35:00.000Z",
  "type": "script",
  "patientID": "patient_washington_robert_7064_4277172",
  "pharmacyID": "pharmacy_cvs_belle_hall_1001",
  "prescriptionDate": "2017-2-04T12:35:00.000Z"

  "meds": [
    {
      "medication_id": "medication_aspirin_200mg_tablet",
      "frequency": "daily",
      "dispensedDate": "2017-2-05T14:48:00.000Z"
    },
    {
      "medication_id": "medication_amlodipine_20mg_syrup",
      "frequency": "4x daily"
    }
  ]
```

## User Story 11 - Dispense medication

Once, I have filled a particular medication within a prescription, I will update the medication with a `dispendedDate`.  Medications with no `dispensedDate` have not been dispensed to the patient.  

```
{
  "_id": "script_patient_washington_robert_7064_4277172_2017-2-04T12:35:00.000Z",
  "type": "script",
  "patientID": "patient_washington_robert_7064_4277172",
  "pharmacyID": "pharmacy_cvs_belle_hall_1001",
  "prescriptionDate": "2017-2-04T12:35:00.000Z"

  "meds": [
    {
      "medication_id": "medication_aspirin_200mg_tablet",
      "frequency": "daily",
      "dispensedDate": "2017-2-05T14:48:00.000Z"
    },
    {
      "medication_id": "medication_amlodipine_20mg_syrup",
      "frequency": "4x daily"
    }
  ]
```

## User Story 12 - View Prescription: Detailed View

As a pharmacist of doctor, I would like the ability to view the patient details, pharmacy details, and medications (not details) for a given pers

-----


### view medication ingredient list

- (done) `GET /medications/ingredients` - returns a unique list of ingredients for all medications.   call dal's `getUniqueIngredients()`.

### view medication forms list

- (done) `GET /medications/forms` - returns a unique list of forms for all medications - call to dal's getUniqueForms()

### view single medication detail

- `/medications/:id` - returns the detail of a single medication. dal's getMed(medId)


# Task List History

## User Story 1 -List Medications

### Database
- (done) create a pharma database - use Fauxton to create a new db.
- (done) model medication document's structure
- (done) add sample medication data into the database
- (done) create meds query: medsByLabel
- (done) create meds query: medsByIngredient

### dal.js
- (done) getMed(medId) - returns details of a single medication. call pouchdb's api : db.get(medID, cb)
- (done) listMedsByLabel() - alpha sort by label - call pouchdb's api: db.query('medsByLabel', {options}, cb)
- (done) listMedsByIngredient() - sort by ingredient - call pouchdb's api:  db.query('medsByIngredient', {options}, cb)

## User Story 2 - List Ingredients and Filter Meds By Ingredients

### Database
 - (done) create medsByIngredient view in couch

### dal.js
 - (done) getUniqueIngredients() - create a function that returns a unique list of ingredients-  hint:  ramda
 - (done) listMedsByIngredient(ingredient, cb) -

## User Story 3 - List forms and Filter Meds By forms

### Database
 - (done) create medsByForm view in couch

### dal.js
- (done) listMedsByForm()
- (done) getUniqueForms() - create a function that returns a unique list of forms -  hint:  ramda
