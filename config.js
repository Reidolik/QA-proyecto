const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    api: {
        port: process.env.API_PORT || 6000,
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'notasecret!'
    },
    mysql: {
        host: process.env.MYSQL_HOST || 'remotemysql.com',
        user: process.env.MYSQL_USER || 'v6pAQsnvl1',
        password: process.env.MYSQL_PASS || 'ijKXLsOv7j',
        database: process.env.MYSQL_DB || 'v6pAQsnvl1',
    }
}