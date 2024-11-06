const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('../middleware/jwt.middleware')
const { body, validationResult } = require('express-validator')

// POST /signup route
router.post('/signup', [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').notEmpty().withMessage('Please provide a valid email.'),
    body('password').matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/).withMessage('Password must be at least 6 characters long and contain at least one number and one uppercase letter.')
], async (req, res) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }
    const { name, email, password } = req.body

    try {

        const foundUser = await User.findOne({ email })
        if (foundUser) {
            return res.status(400).json({ errorMessage: 'Email already in use.' })
        }

        const salt = bcrypt.genSaltSync(10)
        const encryptedPassword = bcrypt.hashSync(password, salt)

        const createdUser = await User.create({ name, email, password: encryptedPassword })
        res.status(201).json(createdUser)
    
    } catch (error) {
        console.error(error)
        res.status(500).json({ errorMessage: 'Error creating user.' })
    }
})


// POST /login route
router.post('/login', async (req, res) => {


    const { email, password } = req.body


    //VALIDATE
    if (!email || !password) {
        return res.status(400).json({ errorMessage: 'Please fill in all the required fields.' })
    }

    try {

        const foundUser = await User.findOne({ email })
        if (!foundUser) {
            return res.status(400).json({ errorMessage: 'No account with this email listed. Please sign up.' })
        }
        
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password)
        if (!passwordCorrect) {
            return res.status(400).json({ errorMessage: 'Password or email is incorrect.' })
        }
        
        const { _id, name } = foundUser
        const payload = { _id, name, email }
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, { algorithm: "HS256", expiresIn: "6h" })
    
        res.json({ authToken })
    } catch (error) {
        console.error(error)
        res.status(500).json({ errorMessage: 'Error logging in.' })

    }
})

router.get('/verify', isAuthenticated, (req, res) => {
    try {
        res.json({ message: 'Verification succesful', payload: req.payload })
    } catch (error) {
        res.status(500).json({ errorMessage: 'Server error during verification ', error })
    }
})

module.exports = router