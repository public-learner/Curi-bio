import { Request, Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import db from '../../db';
import * as yup from 'yup';
import { Op } from "sequelize";

const { User } = db;

import {
    ErrorWithField
} from "../../interfaces/app_interfaces";

const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
	if (token) {
		const AUTH_SECRET : string = process.env.AUTH_SECRET ? process.env.AUTH_SECRET : "secret";
		// verifies secret and checks if the token is expired
		jwt.verify(
			token.replace(/^Bearer\s/, ''),
			AUTH_SECRET ,
			(err: any, decoded: any) => {
				if (err) {
					const err: ErrorWithField = new Error('Unauthorized');
					err.field = 'login';
					return next(err);
				} else {
					req.user = decoded;
					return next();
				}
			}
		);
	} else {
		const err: ErrorWithField = new Error('Unauthorized');
		err.field = 'login';
		return next(err);
	}
};

const isUserExistsUpdate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await User.findOne({
			where: {
				[Op.or]: [
					{ email: req.body.email },
					{ username: req.body.username }
				],
				id: {
					[Op.ne]: req.user.id,
				},
			},
		});

		if (user) {
			const err: ErrorWithField = new Error('Username or Email already registered.');
			err.field = 'email';
			return next(err);
		}

		next();
	} catch (err) {
		return next(err);
	}
};

export {
	authenticateToken,
	isUserExistsUpdate,
};