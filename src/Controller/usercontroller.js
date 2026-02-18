const userService = require('../services/userservices')

const getUserProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(404).send({ error: 'JWT token not found' })
        }
        const jwt = authHeader.split(' ')[1]
        const user = await userService.getUserProfileByToken(jwt)
        return res.status(200).send(user)
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await userService.getAllUsers()
        return res.status(200).send(users);
    } catch (error) {
        return res.status(500).send({ error: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        await userService.deleteUser(userId);
        res.status(200).send({ message: "User deleted successfully", success: true });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

module.exports = { getUserProfile, getAllUsers, deleteUser }