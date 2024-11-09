

const router = require('express').Router()

const { isAuthenticated } = require('../middleware/jwt.middleware')
const User = require('../models/User.model')

router.get('/', isAuthenticated, async (req, res) => {

    try {
        console.log('In user route')
        const userId = req.payload._id
        console.log('user Id: ', userId)
        const userData = await User.findById(userId)
        console.log('found user: ', userData)
        res.status(200).json(userData)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to retrieve user information', error: error.message })
    }
})


module.exports = router

