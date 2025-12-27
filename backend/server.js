const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/kicks', require('./routes/kicks'));

// Sync Database and Start Server
const PORT = process.env.PORT || 5000;

sequelize.sync().then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to sync database:', err);
});
