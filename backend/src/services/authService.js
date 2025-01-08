const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = process.env.APP_JWT_SECRET; 


async function signUp(body) {
    const { email, password, first_name, last_name, phone_number, country, city, street, street_number, postal_code, repeat_password } = body;

    const dbClient = await pool.connect();

    // Check if email already exists
    try{
        await dbClient.query('BEGIN');

        const existingUser = await dbClient.query('SELECT * FROM "USER" WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            await dbClient.query('ROLLBACK');
            return {error: 'Email is already registered'};
        }

        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        const insertUserQuery = `INSERT INTO "USER" (email, password, first_name, last_name, phone)
                                VALUES ($1, $2, $3, $4, $5)
                                RETURNING id`;

        const insertAddressQuery = `INSERT INTO "USER_ADDRESS" (user_id, country, city, street, street_number, postal_code )
                                    VALUES ($1, $2, $3, $4, $5, $6)`;

        // Insert new user into the database
        const insertUserResult = await dbClient.query(insertUserQuery, [email, passwordHash, first_name, last_name, phone_number]);
        const userId = insertUserResult.rows[0].id;

        await dbClient.query(insertAddressQuery, [userId, country, city, street, street_number, postal_code]);
        await dbClient.query('COMMIT');

        return { success: true, userId };
    } catch (error) {
        await dbClient.query('ROLLBACK');
        console.error(error);
        throw error;
    } finally {
        dbClient.release();
    }
}



const login = async ({ email, password }) => {
    try {
        // Fetch user by email
        const userResult = await pool.query('SELECT id, password, is_admin FROM "USER" WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return { error: 'Invalid email or password' }; 
        }

        const user = userResult.rows[0];

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return { error: 'Invalid email or password' };
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, isAdmin: user.is_admin }, // Payload
            secretKey,          // Secret key
            { expiresIn: '30m' } // Expiry time
        );
        return { token };

    } catch (error) {
        console.error('Database error during login:', error);
        throw error;
    } 
};

module.exports = {
    signUp,
    login
};