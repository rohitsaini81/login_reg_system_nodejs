const express = require('express');
const app = express();
const login = require('./logins/login');
const bodyParser = require('body-parser');
const database = require('./DATABASE_FILES/database.js');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const router = express.Router();
app.use('/', require('./ROUTES/routes'));
app.use(router);


app.listen(4000, () => {
    console.log(`Server is running on port http://127.0.0.1:${4000}`);
});