
const router = require('express').Router()

const Exercise = require('../models/Exercise.model')
const Musclegroup = require('../models/Musclegroup.model')

router.post('/by-muscle-groups', async (req, res) => {

    console.log(req.body.muscleGroups)
    try {
        const musclegroupNames = req.body.muscleGroups
        const muscleGroups = await Musclegroup.find({ name: { $in: musclegroupNames } })
        console.log(muscleGroups)
        const muscleGroupIds = muscleGroups.map(muscleGroup => muscleGroup._id)
        console.log(muscleGroupIds)
        const exercises = await Exercise.find({ belongsTo: { $in: muscleGroupIds } }).populate('belongsTo').limit(5)
        console.log(exercises)
        res.json(exercises)
    } catch (error) {
        console.error('Error fetching exercises by muscle groups', error)
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