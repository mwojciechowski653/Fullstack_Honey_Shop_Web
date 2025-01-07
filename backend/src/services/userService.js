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
    const fieldsToUpdateUser = [];
    const valuesUser = [];
    let indexUser = 1; // Indeks placeholderów ($1, $2, itd.)

    // Sprawdzamy i dodajemy tylko te pola, które są niepuste (oprócz haseł)
    const fieldsArrayUser = Object.entries(updatedFields).slice(0, 4); // pierwsze 4 pola

    // Sprawdzanie hasła
    if (updatedFields.password1 && updatedFields.password2) {
        // Jeśli password1 i password2 są takie same
        if (updatedFields.password1 === updatedFields.password2) {
            // Jeśli hasła się zgadzają, dodajemy do zapytania
            fieldsToUpdateUser.push('password = $' + indexUser);
            valuesUser.push(updatedFields.password2); // Używamy password2 jako nowego hasła
            indexUser++;
        } else {
            // Jeśli hasła się nie zgadzają, nie aktualizujemy hasła
            console.error();
        }
    }

    // Dodajemy inne pola
    for (const [field, value] of fieldsArrayUser) {
        if (field !== 'password1' && field !== 'password2') { // pomijamy pola hasła
            fieldsToUpdateUser.push(`${field} = $${indexUser}`);
            valuesUser.push(value);
            indexUser++;
        }
    }

    // Dodajemy id użytkownika jako ostatni argument (do WHERE w tabeli USER)
    valuesUser.push(id);

    // Budujemy zapytanie SQL do aktualizacji w tabeli USER
    const updateUserQuery = `
        UPDATE "USER"
        SET ${fieldsToUpdateUser.join(', ')}
        WHERE id = $${indexUser}
        RETURNING *;
    `;

    const fieldsToUpdateUserAddress = [];
    const valuesUserAddress = [];
    let indexUserAddress = 1;

    // Ograniczamy do pól o indeksach od 5 do 9
    const fieldsArrayUserAddress = Object.entries(updatedFields).slice(4, 9); // od 5 do 9 (indeks 4 do 8)

    for (const [field, value] of fieldsArrayUserAddress) {
        fieldsToUpdateUserAddress.push(`${field} = $${indexUserAddress}`);
        valuesUserAddress.push(value);
        indexUserAddress++;
    }

    // Dodajemy id użytkownika jako ostatni argument (do WHERE w tabeli USER_ADDRESS)
    valuesUserAddress.push(id);

    // Budujemy zapytanie SQL do aktualizacji w tabeli USER_ADDRESS
    const updateUserAddressQuery = `
        UPDATE "USER_ADDRESS"
        SET ${fieldsToUpdateUserAddress.join(', ')}
        WHERE user_id = $${indexUserAddress}
        RETURNING *;
    `;

    console.log('Update USER query:', updateUserQuery);
    console.log('Update USER_ADDRESS query:', updateUserAddressQuery);

    try {
        // Rozpoczynamy transakcję
        await pool.query('BEGIN');

        // Wykonujemy zapytanie do tabeli USER
        const { rows: userRows } = await pool.query(updateUserQuery, valuesUser);
        if (userRows.length === 0) {
            throw new Error('User not found or no changes made in USER');
        }

        // Wykonujemy zapytanie do tabeli USER_ADDRESS
        const { rows: userAddressRows } = await pool.query(updateUserAddressQuery, valuesUserAddress);
        if (userAddressRows.length === 0) {
            throw new Error('User address not found or no changes made in USER_ADDRESS');
        }

        // Zatwierdzamy transakcję
        await pool.query('COMMIT');

        // Zwracamy zaktualizowanego użytkownika oraz adres
        return { user: userRows[0], userAddress: userAddressRows[0] };
    } catch (error) {
        // W przypadku błędu wycofujemy transakcję
        await pool.query('ROLLBACK');
        console.error('Error updating user by id:', error);
        throw new Error('Database update failed');
    }
}

async function addUser(userData) {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Dodanie użytkownika do tabeli USER
        const addUserQuery = `
            INSERT INTO "USER" (
                first_name, 
                last_name, 
                email, 
                phone, 
                password
            ) VALUES ($1, $2, $3, $4, $5)
            RETURNING id;
        `;
        const addUserValues = [
            userData.first_name,
            userData.last_name,
            userData.email,
            userData.phone,
            userData.password // Hasło zahaszowane
        ];
        const { rows: userRows } = await client.query(addUserQuery, addUserValues);
        const userId = userRows[0].id;

        // Dodanie adresu do tabeli USER_ADDRESS
        const addUserAddressQuery = `
            INSERT INTO "USER_ADDRESS" (
                user_id,
                country,
                city,
                street,
                street_number,
                postal_code
            ) VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const addUserAddressValues = [
            userId,
            userData.country,
            userData.city,
            userData.street,
            userData.street_number,
            userData.postal_code
        ];
        await client.query(addUserAddressQuery, addUserAddressValues);

        // Zatwierdzenie transakcji
        await client.query('COMMIT');

        return { success: true, userId };
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error adding user:', error);
        throw new Error('Failed to add user to the database');
    } finally {
        client.release();
    }
}





module.exports = {getUserById, updateUserById, addUser};
