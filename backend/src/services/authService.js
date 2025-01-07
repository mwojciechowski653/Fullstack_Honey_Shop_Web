const pool = require('../db');
const bcrypt = require('bcrypt');


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

module.exports = {
    signUp,
};