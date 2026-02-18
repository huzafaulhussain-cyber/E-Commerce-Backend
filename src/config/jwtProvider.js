const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY  // ab secret env se load hoga

const generateToken = (userId) => {
    const token = jwt.sign({ userId }, SECRET_KEY)
    return token
}

const getUserIdFormToken = (token) => {
    const decoded = jwt.verify(token, SECRET_KEY)
    return decoded.userId
}

module.exports = { generateToken, getUserIdFormToken }
