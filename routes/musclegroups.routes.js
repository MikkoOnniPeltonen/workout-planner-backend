

const router = require('express').Router()

const Musclegroup = require('../models/Musclegroup.model')


router.get('/', async (req, res) => {

    try {
        const allMusclegroups = await Musclegroup.find()
        res.json(allMusclegroups)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to retrieve muscle groups', error: error.message })
    }
})


module.exports = router

