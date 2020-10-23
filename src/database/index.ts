import { Sequelize, DataTypes, Transaction } from 'sequelize';
import Logger from '../utils/Logger';

const db = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './db/database.sqlite',
    transactionType: Transaction.TYPES.IMMEDIATE,
    retry: {
        max: 10,
    }
});

const User = db.define('user', {
    id: {
        type: DataTypes.STRING,
        unique: true,
        primaryKey: true,
    },
    data: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
    }
}, {
    timestamps: false,
});

(async function () {
    await db.sync().catch(Logger.error);
    await db.authenticate().catch(Logger.error);
}());

export { User };