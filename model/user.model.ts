import { Optional, ModelDefined, Sequelize, DataTypes } from 'sequelize';

export default (sequelize: Sequelize) => {
    interface UserAttributes {
        id: number;
        username: string;
        email: string;
        password: string;
        info: string;
        token: string;
    }
    type UserCreationAttributes = Optional<UserAttributes, 'info'>;

    const User: ModelDefined <UserAttributes, UserCreationAttributes> = sequelize.define(
        'User',
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            info: {
                type: DataTypes.STRING,
            },
            token: {
                type: DataTypes.STRING,
            }
        },
        {
            timestamps: true,
            updatedAt: false,
            paranoid: true,
            freezeTableName: true,
            tableName: "Users",
        }
    );

    return User;
};

