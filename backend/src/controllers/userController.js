const userService = require('../services/userService');


async function getUserById(req, res) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' }); // 400 Bad Request
    }

    try {
        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' }); // 404 Not Found
        }

        res.json({ success: true, user }); // 200 OK
    } catch (error) {
        console.error('Error getting user by id:', error);
        res.status(500).json({ success: false, error: error.message }); // 500 Internal Server Error
    }
}

async function updateUserById(req, res) {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
        return res.status(400).json({ success: false, error: 'Invalid user ID' }); // 400 Bad Request
    }

    try {
        const user = await userService.updateUserById(userId, req.body);

        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' }); // 404 Not Found
        }

        res.json({ success: true, user }); // 200 OK
    } catch (error) {
        console.error('Error getting user by id:', error);
        res.status(500).json({ success: false, error: "Error getting user by id" }); // 500 Internal Server Error
    }
}

module.exports = { getUserById, updateUserById };