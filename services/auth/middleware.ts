import { Request, Response, NextFunction } from 'express';
import db from '../../db';
import * as yup from 'yup';
import { Op } from "sequelize";

const { User } = db;

import {
    ErrorWithField
} from "../../interfaces/app_interfaces";

const isUserExistsRegister = async (req: Request, res: Response, next: NextFunction) =>	 {
	try {
		const user = await User.findOne({
			where: {
				[Op.or]: [
					{ email: req.body.email },
					{ username: req.body.username }
				]
			},
		});

		if (user) {
			const err: ErrorWithField = new Error('User already registered');
			err.field = 'task';
			return next(err);
		}

		next();
	} catch (err) {
		return next(err);
	}
};

const validationRegister = async (req: Request, res: Response, next: NextFunction) => {
	let schemaRegister = yup.object().shape({
		email: yup
			.string()
			.required('Please enter Email')
			.email('Please enter valid Email'),
		password: yup
			.string()
			.required('Please enter New Password')
			.min(6, 'Please enter minimum 6 characters'),
		username: yup
			.string()
			.required('Please enter Username')
	});

	schemaRegister
		.validate(
			{
				email: req.body.email,
				password: req.body.password,
				username: req.body.username,
			},
			{ abortEarly: false }
		)
		.then(function () {
			next();
		})
		.catch(function (err) {
			return next(err);
		});
};

const validateLogin = async (req: Request, res: Response, next: NextFunction) => {
	let schemaLogin = yup.object().shape({
		email: yup
			.string()
			.required('Please enter Email')
			.email('Please enter valid Email'),
		password: yup
			.string()
			.required('Please enter New Password')
			.min(6, 'Please enter minimum 6 characters'),
	});
	schemaLogin
		.validate(
			{
				email: req.body.email,
				password: req.body.password,
			},
			{ abortEarly: false }
		)
		.then(function () {
			next();
		})
		.catch(function (err) {
			return next(err);
		});
};

export {
	validateLogin,
	isUserExistsRegister,
	validationRegister,
};