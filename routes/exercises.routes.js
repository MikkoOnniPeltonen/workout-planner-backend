
const router = require('express').Router()

const { isAuthenticated } = require('../middleware/jwt.middleware')
const Exercise = require('../models/Exercise.model')
const Musclegroup = require('../models/Musclegroup.model')
const Workout = require('../models/Workout.model')

router.post('/by-muscle-groups', isAuthenticated,  async (req, res) => {

    const { workoutName, muscleGroups } = req.body
    console.log(req.body)
    try {
        const muscleGroupIds = await Musclegroup.find({ name: { $in: muscleGroups } })
        console.log(muscleGroupIds)

        const exercises = await Exercise.aggregate([{ $match: { belongsTo: muscleGroupIds } }, { $limit: 5 }])
        
        console.log('First array', exercises)

        const exercises2 = await Exercise.find({ belongsTo: { $in: muscleGroupIds } }).limit(5)
            
        console.log(exercises2)

        const workout = {
            name: workoutName,
            exercises: exercises.map(exercise => exercise._id),
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