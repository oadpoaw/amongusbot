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
    if (process.argv.includes('--dbInit')) {
        await db.sync({ force: true }).then(_ => {
            Logger.info(`Database has been dropped`);
        }).catch(Logger.error);
    } else {
        await db.authenticate().then(_ => {
            Logger.info(`Database authenticated`);
        }).catch(Logger.error);
    }
}());

export { User };