const pool = require('../db');

async function getUserById(id) {
    const query = `
            SELECT 
                u.id, u.first_name, u.last_name, u.email,
                ua.country,
                ua.city, ua.street, ua.street_number, ua.postal_code, u.phone
            FROM "USER" u 
            LEFT JOIN "USER_ADDRESS" ua 
            ON u.id = ua.user_id
            WHERE u.id = $1`;
    
    try {
        const {rows} = await pool.query(query, [id]);
        if (rows.length === 0)
            return null;
        const user = {
            id: rows[0].id,
            first_name: rows[0].first_name,
            last_name: rows[0].last_name,
            email: rows[0].email,
            user_phone: rows[0].phone,
            country: rows[0].country,
            city: rows[0].city,
            street: rows[0].street,
            street_number: rows[0].street_number,
            postal_code: rows[0].postal_code
            };
        return user;
        } catch (error) {
            console.error('Error getting user by id:', error);
            throw new Error('Database query failed');
        }
}

async function updateUserById(id, updatedFields) {
    // Generujemy część zapytania SQL dla pól, które wymagają aktualizacji
    const fieldsToUpdate = [];
    const values = [];
    let index = 1; // Indeks placeholderów ($1, $2, itd.)

    for (const [field, value] of Object.entries(updatedFields)) {
        fieldsToUpdate.push(`${field} = $${index}`);
        values.push(value);
        index++;
    }

    // Dodajemy id jako ostatni argument (do WHERE)
    values.push(id);

    // Budujemy zapytanie SQL do aktualizacji
    const query = `
        UPDATE "USER"
        SET ${fieldsToUpdate.join(', ')}
        WHERE id = $${index}
        RETURNING *;
    `;

    try {
        // Wykonujemy zapytanie SQL
        const { rows } = await pool.query(query, values);

        if (rows.length === 0) {
            throw new Error('User not found or no changes made');
        }

        return rows[0]; // Zwracamy zaktualizowanego użytkownika
    } catch (error) {
        console.error('Error updating user by id:', error);
        throw new Error('Database update failed');
    }
}





module.exports = {getUserById};