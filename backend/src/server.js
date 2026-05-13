require('dotenv').config();
const app = require('./app');
const connection = require('./config/database');

const port = process.env.PORT || 8080;

(async () => {
    try {
        await connection();

        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        });
    } catch (error) {
        console.log('>>> Error connect to DB: ', error);
        process.exitCode = 1;
    }
})();