const router = require('express').Router()
const User = require('../models/User.model')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { isAuthenticated } = require('../middleware/jwt.middleware')

// POST /signup route
router.post('/signup', (req, res) => {

    const { name, email, password } = req.body

    if (name==="", email==="", password==="") {
        res.status(400).json({errorMessage: "Please provide all the mandatory fields"})
        return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
        res.status(400).json({errorMessage:"Please provide a valid email."})
        return
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if (!passwordRegex.test(password)) {
        res.status(400).json({errorMessage: "Password did not match the requirements. Please provide a new password."})
        return
    }

    User.findOne({email})
    .then((foundUser) => {

        if (foundUser) {
            res.status(400).json({errorMessage:"Email already in use."})
            return
        }
    })

    const salt = bcrypt.genSaltSync(10)
    // hashSync is the method that encrypts our password
    const encryptedPassword = bcrypt.hashSync(password, salt)

    console.log(encryptedPassword)

    User.create({ name, email, password:encryptedPassword })
    .then((createdUser) => {
        res.status(201).json(createdUser)
    })
    .catch((err) => {
        res.status(400).json({errorMessage:'email should be unique, please sign up with unique email.'})
        console.log(err)
    })
})


// POST /login route
router.post('/login', (req, res) => {


    const { email, password } = req.body


    //VALIDATE
    if (email ==="" || password=="") {
        console.log("no email or passwrod")
        res.status(400).json({errorMessage: "Please fill in all the required fields"})
        return
    }

    // CHECK IF THE PASSWORD IS CORRECT

    User.findOne({email: email})
    .then((foundUser) => {

        if (!foundUser) {
            consoe.log("user not found")
            res.status(400).json({errorMessage: "Please sign up, no account with this email listed."})
            return
        }
        
        const passwordCorrect = bcrypt.compareSync(password, foundUser.password)

        if (passwordCorrect) {

            // CREATE THE TOKEN

            const { email, name, _id } = foundUser

            const payload = { email, name, _id }

            // method that returns the JWT token
            const authToken = jwt.sign(
                payload,
                process.env.TOKEN_SECRET,
                {algorithm:'HS256', expiresIn:'6h'}
            )

            console.log(authToken)

            // SEND BACK THE TOKEN
            res.json({authToken: authToken})
            return

        }
        else {
            console.log("in else")
            res.status(400).json({errorMessage:"Password or email is incorrect"})
            return
        }
    })
    .catch((err) => {
        console.log("in catch")
        res.json(err)
    })


})

router.get('/verify', isAuthenticated, (req, res) => {

    res.json(req.payload)
})

module.exports = router