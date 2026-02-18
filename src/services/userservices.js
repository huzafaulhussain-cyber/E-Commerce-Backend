const userModel = require('../model/usermodel')
const bcrypt = require('bcrypt')
const jwtProvider = require('../config/jwtProvider')

const createUser = async (userData) => {
    try {
        let { firstName, lastName, password, email, } = userData
        const isUserExit = await userModel.findOne({ email })
        if (isUserExit) {
            throw new Error('Sorry User is already exist')
        }
        password = await bcrypt.hash(password, 8)
        const User = await userModel.create({
            firstName,
            lastName,
            password,
            email,
        })
        console.log('User Created Successfully', User)
        return User;
    } catch (error) {
        throw new Error(error.message)
    }
}

const findUserById = async (userId) => {
    try {
        const user = await userModel.findById(userId).populate('address')
        if (!user) {
            throw new Error(`User not found with id: ${userId}`)
        }
        return user
    }
    catch (error) {
        throw new Error(error.message)
    }
}

const getUserByEmail = async (email) => {
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            throw new Error(`User not found with email: ${email}`)
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message)
    }
}

const getUserProfileByToken = async (token) => {
    try {
        const userId = jwtProvider.getUserIdFormToken(token)
        const user = await findUserById(userId)
        if (!user) {
            throw new Error(`User not found with id: ${userId}`)
        }
        return user;
    } catch (error) {
        throw new Error(error.message)
    }
}

const getAllUsers = async () => {
    try {
        const user = await userModel.find()
        return user;
    }
    catch (error) {
        throw new Error(error.message)
    }
}

const deleteUser = async (userId) => {
    try {
        const user = await userModel.findByIdAndDelete(userId)
        if (!user) {
            throw new Error(`User not found with id: ${userId}`)
        }
        return user;
    }
    catch (error) {
        throw new Error(error.message)
    }
}

module.exports = { createUser, findUserById, getUserByEmail, getUserProfileByToken, getAllUsers,deleteUser }
