
const router = require('express').Router()

const { isAuthenticated } = require('../middleware/jwt.middleware')
const Exercise = require('../models/Exercise.model')
const Musclegroup = require('../models/Musclegroup.model')
const Workout = require('../models/Workout.model')

router.post('/by-muscle-groups', isAuthenticated,  async (req, res) => {

    const { workoutName, muscleGroups } = req.body
    console.log(req.body)
    try {
        const muscleGroupNames = await Musclegroup.find({ name: { $in: muscleGroups } })
        console.log(muscleGroupNames)

        const muscleGroupIds = muscleGroupNames.map(muscleGroup => muscleGroup._id)
        console.log(muscleGroupIds)

        const exercises3 = await Exercise.find([{ 'belongsTo._id': muscleGroupIds }]).limit(5)
        console.log('first test exercise array', exercises3)

        const exercises5 = await Exercise.aggregate([{ belongsTo: { $match:  { _id: muscleGroupIds } } }]).limit(5)
        console.log('second test exercise array', exercises5)

        const exercises10 = await Exercise.find([{ 'belongsTo._id': muscleGroupIds }]).limit(5)
        console.log('third test exercise array', exercises10)

        const exercises2 = await Exercise.aggregate([{ $match: { 'belongsTo': { _id: muscleGroupIds } } }]).limit(5)
        console.log('fourth array of test', exercises2)

        const exercises = await Exercise.find([{ belongsTo: { $in: muscleGroupIds } }]).limit(5)
        console.log('found exercises by id of musclegroup', exercises)
            
        const workout = {
            name: workoutName,
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