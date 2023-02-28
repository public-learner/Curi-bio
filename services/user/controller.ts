import { Request, Response, NextFunction } from 'express';
import db from '../../db';
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { Op } from "sequelize";

import {
    ErrorWithField
} from "../../interfaces/app_interfaces";

const { User } = db;

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const id = req.user.id;
		const username = req.body.username;
		const info = req.body.info;
		const email = req.body.email;

		const result = User.update(
			{
				username: username,
				info: info,
				email: email,
			},
			{
				where: {
					id: {
						[Op.eq]: id,
					},
				},
			}
		);

		return res.json({
			status: 'success',
			result: req.body,
		});
	} catch (err) {
		return next(err);
	}
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const id = req.params.id;
		const deleted = await User.destroy({
			where: {
				id: id,
			},
		});
		
		if (deleted) {
			return res.json({
				status: 'success',
				result: "Record removed successfully"
			});
		} else {
			return res.json({
				status: 'failed',
				result: "Record id is not valid"
			});
		}
        
	} catch (err) {
		console.log(err);
		return next(err);
	}
};

const getUserInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
		const id = req.user.id;
		const user = await User.findOne({
			where: {
				id: id,
			},
        });
        
        if (user) {
			return res.json(user);
        } else {
            const err: ErrorWithField = new Error('User not exist');
            err.field = 'login';
            return next(err);
        }
	} catch (err) {
		return next(err);
	}
};

export default {
    update,
    remove,
    getUserInfo,
};