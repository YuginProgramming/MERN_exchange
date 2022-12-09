import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator';

import { registerValidation } from './validations/auth.js';

import UserModel from './models/User.js'
import User from './models/User.js';

mongoose
.connect(
    'mongodb+srv://admin:gggggg@cluster0.oxmexiq.mongodb.net/nadot?retryWrites=true&w=majority'
 )
.then(() => console.log('DB up'))
.catch((err) => console.log('DB error', err));

const app = express();

app.use(express.json());

app.post('/auth/login', async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                message: 'there is no such user',
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        
        if (!isValidPass) {
            return res.status(404).json({
                message: 'invalid login or password',
            });
        }
        
        const token = jwt.sign({
            _id: user._id,
        },
            'crypsicret',
        {
            expiresIn: '30d',
        },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,    
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'faild to sign in',
      })
    }
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
        return res.status(400).json(errors.array());
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign({
            _id: user._id,
        },
            'crypsicret',
        {
            expiresIn: '30d',
        },
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,    
        });
    }   catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'failed to register'
        });
    }
});

app.listen(3333, (err) => {
    if (err) {
    return console.log(err);
    }
    console.log('server up')
});


