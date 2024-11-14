
const router = require('express').Router()

const Exercise = require('../models/Exercise.model')


router.get('/', async (req, res) => {

    try {
        const allExercises = await Exercise.find()
        res.json(allExercises)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router