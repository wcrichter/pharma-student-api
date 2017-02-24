# Pharmacy API

## User Stores

### User Story 1 - List Medications

As a doctor, I would like the ability to view a list of medications (alpha sort by label and sort by ingredient) and select a single medication so that I can view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

A medication contains the following information:

- label (string) Ex: Aspirin 100mg tablet
- ingredients (array of strings) Ex: ["Aspririn"]
- amount (number) Ex: 100
- unit (string) Ex: "mg"
- form (string) Ex: "tablet"

### User Story 2 - List Ingredients and Filter Meds By Ingredients

As a doctor, I would like the ability to view a unique list of ingredients used in all our medications. After selecting an ingredient from the list, provide a filtered list of medications that contain the selected ingredient.  After selecting a single medication, I want to view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

### User Story 3 - List forms and filter meds by form

As a doctor, I would like the ability to view a unique list of medication forms (syrup, tablet, patch...) used in all our medications. After selecting an form from the list, provide a filtered list of medications that contain the selected form.  After selecting a single medication, I want to view the medication details, such as ingredients, amount, and form (such as liquid, tablet, patch, etc.).

## API Resources/Endpoints

### view medication list

- `GET /medications` - returns a collection of medications default sorted by label -  dal's listMedsByLabel()
- `GET /medications?filter=ingredient:aspirin` - filters a collection of medications by specified ingredient  `dal.listMedsByIngredient(ingredient, cb)`
- `GET /medications?filter=form:tablet`  - filters a collection of medications by form (tablet, syrup, patch) `dal.listMedsByForm(form, cb)`

### view medication ingredient list

- `GET /medications/ingredients` - returns a unique list of ingredients for all medications.   call dal's `getUniqueIngredients()`.

### view medication forms list

- `GET /medications/forms` - returns a unique list of forms for all medications - call to dal's getUniqueForms()

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
