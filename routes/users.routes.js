

const router = require('express').Router()

const User = require('../models/User.model')
const mongoose = require('mongoose')

router.get('/', async (req, res) => {

    try {
        const userId = req.payload._id
        const userData = await User.findById(mongoose.Types.ObjectId(userId))
        res.status(200).json(userData.name)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to retrieve user information', error: error.message })
    }
})


module.exports = router

