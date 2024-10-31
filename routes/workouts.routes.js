

const router = require('express').Router()
const Workout = require('../models/Workout.model')

const { isAuthenticated } = require('../middleware/jwt.middleware')

router.post('/', isAuthenticated, async (req, res) => {

    Workout.create(req.body)
    .then((createdWorkout) => {res.json(createdWorkout)})
    .catch((err) => {res.json(err)})
    console.log(createdWorkout._id)

})


router.get('/', (req, res) => {

    Workout.find()
    .then((allWorkouts) => {
        res.json(allWorkouts)
    })
    .catch((err) => {res.json(err)})

})

router.get('/:workoutId', (req, res) => {

    Workout.findById(req.params.workoutId)
    .then((foundWorkout) => {
        res.json(foundWorkout)
    })
    .catch((err) => {
        res.json(err)
    })
})

router.put('/:workoutId', isAuthenticated, (req, res) => {

    Workout.findByIdAndUpdate(req.params.workoutId, req.body, {new: true})
    .then((updatedWorkout) => {
        res.json(updatedWorkout)
    })
    .catch((err) => {
        res.json(err)
    })
})


router.delete('/:workoutId', isAuthenticated, async (req, res) => {

    try {
        const deletedWorkout = await Workout.findByIdAndDelete(req.params.workoutId)

        res.json(deletedWorkout)

    }
    catch(err) {
        res.json(err)
    }
})


module.exports = router