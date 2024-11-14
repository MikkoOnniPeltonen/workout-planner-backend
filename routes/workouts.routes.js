

const router = require('express').Router()
const Workout = require('../models/Workout.model')
const _ = require('lodash')
const { isAuthenticated } = require('../middleware/jwt.middleware')

router.get('/by-musclegroup/:workoutId', async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.workoutId)
        .populate({ path: 'exercises', populate: { path: 'belongsTo', model: 'Musclegroup'}})
    
        if (!workout) {
            return res.status(404).json({ message: 'Workout not found' })
        }

        res.json(workout)
    } catch (error) {
        console.error(error)
        res.status(500).json({ errorMessage: 'Server error' })
    }
})


router.get('/', isAuthenticated, async (req, res) => {

    try {
        const userId = req.payload._id
        console.log('User id was found: ', userId)
        const workouts = await Workout.find({ creator: userId })
        .populate( { path: 'exercises', populate: { path: 'belongsTo', model: 'Musclegroup' } })
        

        console.log(workouts)
        res.json(workouts)
    } catch (error) {
        console.log(error)
        res.status(500).json({ errorMessage: 'Error fetching workouts', error })
    }

})

router.post('/', isAuthenticated,  async (req, res) => {

    console.log(req.body)
    try {
        const { name, exercises } = req.body
        let workout = {
            name: name,
            exercises: exercises,
            creator: req.payload._id
        }
        
        console.log(workout)
        const savedWorkout = await Workout.create(workout)
        res.json(savedWorkout)
    } catch (error) {
        console.error('Error creating a workout', error)
        res.status(500).json({ errorMessage: 'Server error'})
    }
})

router.put('/:workoutId', isAuthenticated, async (req, res) => {

    try {
        const { name, exercises } = req.body
        const creatorId = req.payload._id
        console.log('creator id is: ', creatorId)
        
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

        if (exercises && !_.isEqual(exercises, existingWorkout.exercises)) {
            updatedFields.exercises = exercises.map(exerciseId => exerciseId)
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
})


router.delete('/:workoutId', isAuthenticated, async (req, res) => {

    try {
        const workout = await Workout.findById(req.params.workoutId)

        if (!workout) {
            return res.status(404).json({ errorMessage: 'Workout not found'})
        }

        if (workout.creator.toString() !== req.payload._id) {
            return res.status(403).json({ errorMessage: 'You are not authorized to delete this workout'})
        }

        const deletedWorkout = await Workout.findByIdAndDelete(req.params.workoutId)

        res.json({ message: 'Workout deleted succesfully', deletedWorkout })

    }
    catch(err) {
        res.status(500).json({ errorMessage: 'Error deleting workout', err})
    }
})


module.exports = router