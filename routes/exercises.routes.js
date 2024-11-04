
const router = require('express').Router()

const Exercise = require('../models/Exercise.model')


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