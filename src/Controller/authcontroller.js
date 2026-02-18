 
const userService = require('../services/userservices')
const jwtProvider = require('../config/jwtProvider')
const cartService = require('../services/cartservice')
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body)
        const jwt = jwtProvider.generateToken(user._id)
        await cartService.createCart(user)
        return res.status(200).send({ jwt, message: 'User Register Successfully' })
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await userService.getUserByEmail(email)
        if (!user) {
            return res.status(404).send({ message: 'Email not found :', email })
        }
        const ispasswordValid = await bcrypt.compare(password, user.password)
        if (!ispasswordValid) {
            return res.status(401).send({ message: 'Invalid password' })
        }

        const jwt = jwtProvider.generateToken(user._id)
 
            return res.status(200).send({
                jwt,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    role: user.role, // "ADMIN" yahan hona chahiye
                    email: user.email,
                    message: "Login Successfully"
        }
    });
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

module.exports = { register, login }