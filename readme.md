# Pharmacy API

## User Stores

### User Story 1 - List Medications

As a doctor, I would like the ability to view a list of medications (alpha sort by label and sort by ingredient) and select a single medication so that I can view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

A medication contains the following information:

- label (string) Ex: Aspirin 100mg tablet
- ingredients (array of strings) Ex: ["Aspirin"]
- amount (number) Ex: 100
- unit (string) Ex: "mg"
- form (string) Ex: "tablet"

### User Story 2 - List Ingredients and Filter Meds By Ingredients

As a doctor, I would like the ability to view a unique list of ingredients used in all our medications. After selecting an ingredient from the list, provide a filtered list of medications that contain the selected ingredient.  After selecting a single medication, I want to view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

### User Story 3 - List forms and filter meds by form

As a doctor, I would like the ability to view a unique list of medication forms (syrup, tablet, patch...) used in all our medications. After selecting an form from the list, provide a filtered list of medications that contain the selected form.  After selecting a single medication, I want to view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

### User Story 4 - Manage Patients

As an medical assistant or RN within the doctor's office, I need the ability to manage basic patient demographic information and conditions.:

- patientNumber Ex: 1239484
- firstName Ex: Gomez
- lastName "Adams"
- age 70,
- gender "M",
- ethnicity "H".  Valid ethnicity codes include ("W - White, AA - African American, H - Hispanic, NA - Native American/ Pacific Islander")
- last4SSN  "6664",
- conditions: Ex:  [
    "Anxiety",
    "Hypertension",
    "Hyperthyroid"
  ]

## User Story 5 - Search Patients By Last Name

As a medical professional or pharmacist, I desire the ability to search for patients by last name so that I can view basic a patient's demographic and medical conditions.  

## User Story 6 - Search Patients By Conditions

As a medical professional or pharmacist, I desire the ability to search for patients by conditions so that I can view basic a patient's demographic and medical conditions.  I want to pick from a unique list of all patient conditions in the database.  Once a condition is selected, I want to view all patients with the related condition.  

## User Story 7 - Manage Pharmacies

As a medical assistant, I need the ability to maintain a list of pharmacies so that doctors can prescribe medications to patients.  I need the ability to manage the following information:

  - storeNumber- "1001"
  - storeChainName -  "CVS"
  - streetAddress - "2000 Belle Hall Lane"
  - phone
  - city - "Mount Pleasant"
  - state - "SC"
  - zipCode - "29464"

# User Story 8 - Search Pharmacies By storeNumber

  - As a medical assistant, I need the ability to search for pharmacies by store number or zip code when prescribing medications.  




## API Resources/Endpoints

### view medication list

- (done)`GET /medications` - returns a collection of medications default sorted by label -  dal's listMedsByLabel()
- (done)`GET /medications?filter=ingredient:aspirin` - filters a collection of medications by specified ingredient  `dal.listMedsByIngredient(ingredient, cb)`
- (done)`GET /medications?filter=form:tablet`  - filters a collection of medications by form (tablet, syrup, patch) `dal.listMedsByForm(form, cb)`

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
