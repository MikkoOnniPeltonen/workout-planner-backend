

const {expressjwt: jwt} = require('express-jwt')

const TOKEN_SECRET = process.env.TOKEN_SECRET
const TOKEN_ALGORITHM = 'HS256'

const isAuthenticated = jwt({
    secret: TOKEN_SECRET,
    algorithms: [TOKEN_ALGORITHM],
    requestProperty: 'payload',
    getToken: getTokenFromHeaders
})

function getTokenFromHeaders(req) {

    const authHeader = req.headers.authorization
    console.log(authHeader)

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        console.log('middleware token: ', token)
        return token
    }

    return null
}

function jwtErrorHandler(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({ errorMessage: 'Invalid or missing token' })
    }
    next(err)
}

module.exports = { isAuthenticated, jwtErrorHandler }