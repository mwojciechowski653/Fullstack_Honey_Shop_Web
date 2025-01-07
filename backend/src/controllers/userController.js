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
        res.status(500).json({ success: false, error: error.message }); // 500 Internal Server Error
    }
}

async function addUserById(req, res) {
    const {
        first_name,
        last_name,
        email,
        phone,
        password1,
        password2,
        country,
        city,
        street,
        street_number,
        postal_code
    } = req.body;

    try {
        // Walidacja haseł
        if (!password1 || !password2 || password1 !== password2) {
            return res.status(400).json({
                success: false,
                error: "Passwords do not match or are missing."
            }); // 400 Bad Request
        }

        // Haszowanie hasła
        const hashedPassword = await bcrypt.hash(password1, 10);

        // Tworzymy dane użytkownika
        const userData = {
            first_name,
            last_name,
            email,
            phone,
            password: hashedPassword, // Zapisujemy zahaszowane hasło
            country,
            city,
            street,
            street_number,
            postal_code
        };

        // Wywołanie funkcji w serwisie userService
        const result = await userService.addUser(userData);

        // Sprawdzamy, czy użytkownik został pomyślnie dodany
        if (result && result.userId) {
            return res.status(201).json({
                success: true,
                message: "User added successfully.",
                userId: result.userId
            }); // 201 Created
        }

        // W razie jakiegokolwiek błędu zwracamy ogólny błąd
        return res.status(500).json({
            success: false,
            error: "Failed to add user."
        }); // 500 Internal Server Error
    } catch (error) {
        console.error('Error adding user:', error);

        // W razie błędu zwracamy odpowiedź
        return res.status(500).json({
            success: false,
            error: error.message || "An unexpected error occurred."
        }); // 500 Internal Server Error
    }
}


module.exports = { getUserById, updateUserById, addUserById };