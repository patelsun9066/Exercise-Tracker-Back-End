import 'dotenv/config';
import express from 'express';
import * as exercises from './exercises-model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());


// CREATE controller ******************************************
app.post ('/exercises', (req,res) => { 
    exercises.createExercise(
        req.body.name, 
        req.body.reps, 
        req.body.weight,
        req.body.unit,
        req.body.date
        )
        .then(exercise => {
            res.status(201).json(exercise);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error: 'Invalid request' });
        });
});


// RETRIEVE controller ****************************************************
// GET exercises by ID
app.get('/exercises/:_id', (req, res) => {
    const exerciseId = req.params._id;
    exercises.findExerciseById(exerciseId)
        .then(exercise => { 
            if (exercise !== null) {
                res.json(exercise);
            } else {
                res.status(404).json({ Error: 'Not found' });
            }         
         })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Request to retrieve document failed' });
        });

});


// GET movies to retreive all exercises in collection
app.get('/exercises', (req, res) => {
    let filter = {};
    // filter by name
    if(req.query.name !== undefined){
        filter = { name: req.query.name };
    }
    // filter by reps
    if(req.query.reps !== undefined){
        filter = { reps: req.query.reps };
    }
    // filter by weight
    if(req.query.weight !== undefined){
        filter = { weight: req.query.weight };
    }
    // filter by unit
    if(req.query.unit !== undefined){
        filter = { unit: req.query.unit };
    }
    // filter by date
    if(req.query.date !== undefined){
        filter = { date: req.query.date };
    }
    exercises.findExercises(filter, '', 0)
        .then(exercises => {
            res.send(exercises);
        })
        .catch(error => {
            console.error(error);
            res.send({ Error: 'Request to retrieve documents failed' });
        });

});

// DELETE Controller ******************************
app.delete('/exercises/:_id', (req, res) => {
    exercises.deleteById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) {
                res.status(204).send();
            } else {
                res.status(404).json({ Error: 'not found' });
            }
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request to delete a document failed' });
        });
});

// UPDATE controller ************************************
app.put('/exercises/:_id', (req, res) => {

    if (req.body.name !== null && req.body.reps !== null && req.body.weight !== null && req.body.unit !== null && req.body.date !== null &&
        req.body.name !== "" && req.body.reps !== "" && req.body.weight !== "" && req.body.unit !== "" && req.body.date !== "" && +req.body.reps > 0 && +req.body.weight > 0 &&
        req.body.name !== undefined && req.body.reps !== undefined && req.body.weight !== undefined && req.body.unit !== undefined && req.body.date !== undefined) {
        
        exercises.replaceExcercise(
            req.params._id, 
            req.body.name, 
            req.body.reps, 
            req.body.weight,
            req.body.unit,
            req.body.date
        )

        .then(numUpdated => {
            if (numUpdated === 1) {
                res.json({ 
                    _id: req.params._id, 
                    name: req.body.name, 
                    reps: req.body.reps, 
                    weight: req.body.weight,
                    unit: req.body.unit,
                    date: req.body.date
                })
            } else {
                res.status(404).json({ Error: 'Document not found' });
            }
            
        })
        .catch(error => {
            console.error(error);
            res.status(400).json({ Error: 'Invalid Request' });
        });

    } else {
        res.status(400).json({ Error: 'Invalid Request' });
    }

});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});