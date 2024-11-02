
const router = require('express').Router()

const { isAuthenticated } = require('../middleware/jwt.middleware')
const Exercise = require('../models/Exercise.model')
const Musclegroup = require('../models/Musclegroup.model')
const Workout = require('../models/Workout.model')

router.post('/by-muscle-groups', isAuthenticated,  async (req, res) => {

    console.log(req.body.muscleGroups)
    try {
        const creatorId = req.user._id
        console.log(req.user._id, 'ID OF THE USER')
        const musclegroupNames = req.body.muscleGroups
        const muscleGroups = await Musclegroup.find({ name: { $in: musclegroupNames } })
        console.log(muscleGroups)

        const muscleGroupIds = muscleGroups.map(muscleGroup => muscleGroup._id)
        console.log(muscleGroupIds)

        const exercises = await Exercise.find({ belongsTo: { $in: muscleGroupIds } }).populate('belongsTo').limit(5)
        console.log(exercises)
            
        const workoutName = req.body.workoutName
        const workout = {
            name: workoutName,
            exercises: exercises,
            creator: creatorId
        }

        const savedWorkout = await Workout.create(workout)
        res.json(savedWorkout)
    } catch (error) {
        console.error('Error creating a workout', error)
        res.status(500).json({ errorMessage: 'Server error'})
    }
})


router.get('/', (req, res) => {

    Exercise.find()
    .then((allExercises) => {
        res.json(allExercises)
    })
    .catch((err) => {
        res.status(500).json(err)
    })
})

module.exports = router