 
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        return res.status(403).send({ message: "Access denied. Only Admins allowed." });
    }
};
module.exports = isAdmin;