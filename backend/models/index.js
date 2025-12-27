const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', process.env.DATABASE_PATH || 'database.sqlite'),
    logging: false
});

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

const Kick = sequelize.define('Kick', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

User.hasMany(Kick, { onDelete: 'CASCADE' });
Kick.belongsTo(User);

module.exports = {
    sequelize,
    User,
    Kick
};
