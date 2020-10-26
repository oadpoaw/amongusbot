"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const Logger_1 = __importDefault(require("../utils/Logger"));
const db = new sequelize_1.Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: './db/database.sqlite',
    transactionType: sequelize_1.Transaction.TYPES.IMMEDIATE,
    retry: {
        max: 10,
    }
});
const User = db.define('user', {
    id: {
        type: sequelize_1.DataTypes.STRING,
        unique: true,
        primaryKey: true,
    },
    data: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: false,
        defaultValue: {},
    }
}, {
    timestamps: false,
});
exports.User = User;
(async function () {
    await db.sync().catch(Logger_1.default.error);
    await db.authenticate().catch(Logger_1.default.error);
}());
