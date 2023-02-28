import { Request, Response, NextFunction } from 'express';
import db from '../../db';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import crypto from "crypto";

import {
    ErrorWithField
} from "../../interfaces/app_interfaces";

const { User } = db;

const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const username = req.body.username;
        const email = req.body.email;

		// encrypt password
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);
		const password = hash;

		const token = crypto.randomBytes(16).toString('hex');

        const record = await User.create({
            username: username,
			email: email,
			password: password,
			token: token,
		});


		return res.json({
			status: 'success',
			result: {
				record: record,
			},
		});
    } catch (err) {
        console.log(err)
		return next(err);
	}
};

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
			where: {
				email: email,
			},
        });
        
        if (user) {
            const isMatched = await bcrypt.compare(password, user.password);

            if (isMatched === true) {
                const AUTH_SECRET : string = process.env.AUTH_SECRET ? process.env.AUTH_SECRET : "secret";
				const userData = {
					id: user.id,
					email: user.email,
                    username: user.username,
                    info: user.info
                };

				return res.json({
					user: userData,
					token: jwt.sign(userData, AUTH_SECRET, {
						expiresIn: '2h',
					}), // Expires in 2 Hour
				});
			} else {
				const err: ErrorWithField = new Error('Invalid email or password entered');
				err.field = 'login';
				return next(err);
			}
        } else {
            const err: ErrorWithField = new Error('Invalid email or password entered');
            err.field = 'login';
            return next(err);
        }

        res.json({ email: email });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export default {
    login,
    register
};