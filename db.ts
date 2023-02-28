import { Sequelize } from "sequelize";
import dbconfig from './config/database';

import userModel from "./model/user.model";

const env: string = process.env.NODE_ENV ? process.env.NODE_ENV : "default";
const sequelize = new Sequelize(dbconfig[env]);

const db: any = {};

db.authenticate = () => sequelize.authenticate();
db.User = userModel(sequelize);

export default db;