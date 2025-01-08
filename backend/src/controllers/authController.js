const { body, validationResult } = require('express-validator');
const authService = require('../services/authService');

const signUpValidators = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
    body('first_name').isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
    body('last_name').isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
    body('phone_number').isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters long'),
    body('country').isLength({ min: 2 }).withMessage('Country must be at least 2 characters long'),
    body('city').isLength({ min: 2 }).withMessage('City must be at least 2 characters long'),
    body('street').isLength({ min: 2 }).withMessage('Street must be at least 2 characters long'),
    body('street_number').isLength({ min: 1 }).withMessage('Street number must be at least 1 character long'),
    body('postal_code').isLength({ min: 4 }).withMessage('Postal code must be at least 4 characters long'),
    body('repeat_password').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
]

const loginValidators = [
    body('email').isEmail().withMessage('Invalid email format'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 6 characters long'),
];

async function signUp(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const signUpResult =  await authService.signUp(req.body);

        if (signUpResult.error) {
            return res.status(400).json({ error: signUpResult.error });
        }
        res.status(201).json({ message: "User registered successfully",userId: signUpResult.userId }).send();
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
}

const login = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await authService.login(req.body);

        if (result.error) {
            return res.status(401).json({ error: result.error });
        }

        res.status(200).json({
            message: 'Login successful',
            token: result.token,
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signUp,
    signUpValidators,
    login, 
    loginValidators
};
