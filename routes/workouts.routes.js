

const router = require('express').Router()
const Workout = require('../models/Workout.model')
const Musclegroup = require('../models/Musclegroup.model')

const { isAuthenticated } = require('../middleware/jwt.middleware')

router.get('/', (req, res) => {

    Workout.find()
    .populate('exercises')
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

router.put('/:workoutId', isAuthenticated, async (req, res) => {

    try {
        const { name, exercises } = req.body
        const creatorId = req.user._id

        const existingWorkout = await Workout.findById(req.params.workoutId)
        if (!existingWorkout) {
            return res.status(404).json({ errorMessage: "Workout not found" })
        }

        const updatedFields = {
            creator: creatorId
        }

        if (name && name !== existingWorkout.name) {
            updatedFields.name = name
        }

        if (exercises && JSON.stringify(exercises) !== JSON.stringify(existingWorkout.exercises)) {
            updatedFields.exercises = exercises
        }

        if (Object.keys(updatedFields).length > 0) {
            const updatedWorkout = await Workout.findByIdAndUpdate(req.params.workoutId, updatedFields, { new: true })
            res.json(updatedWorkout)
        } else {
            res.json(existingWorkout)
        }
    } catch (error) {
        console.error('Error updating workout', error)
        res.status(500).json({ errorMessage: 'Server error' })
    }
    


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