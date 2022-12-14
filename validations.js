import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'At least 5 symbols').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Wrong email').isEmail(),
    body('password', 'At least 5 symbols').isLength({ min: 5 }),
    body('fullName', 'Write a name').isLength({ min: 3 }),
    body('avatarUrl', 'Not a link').optional().isURL(),
];

export const postCreateValidation = [
    body('title', 'Enter a post title').isLength({ min: 3 }).isString(),
    body('text', 'Enter a post text').isLength({ min: 5 }).isString(),
    body('tags', 'Incorrect tag format').optional().isString(),
    body('imageUrl', 'Incorrect imageLink').optional().isString(),
];