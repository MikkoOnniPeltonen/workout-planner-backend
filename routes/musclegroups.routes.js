

const router = require('express').Router()

const Musclegroup = require('../models/Musclegroup.model')


router.get('/', (req, res) => {

    Musclegroup.find()
    .then((allMusclegroups) => {
        res.json(allMusclegroups)
    })
    .catch((err) => {res.json(err)})
})


module.exports = router

