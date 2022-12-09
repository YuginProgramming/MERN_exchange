import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'wrong email').isEmail(),
    body('password', 'at least 5 symbols').isLength({ min: 5 }),
    body('fullName', 'write a name').isLength({ min: 3 }),
    body('avatarUrl', 'not a link').optional().isURL(),
];