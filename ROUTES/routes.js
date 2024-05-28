

const Ai = require('../AI.js')
const login = require('../logins/login');
const database = require('../DATABASE_FILES/database.js');

const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {

    res.sendFile(__dirname + '/index.html');
});
router.get('/home', (req, res) => {

    console.log("Cookies: ", req.cookies);
    // res.send('Welcome to the homepage');

    if (req.cookies) {
        console.log(req.cookies);
        const receivedCookie = req.cookies.sessionId ? req.cookies.sessionId : "";
        console.log(receivedCookie);
        const [userId, sessionId] = receivedCookie.split("%");
        console.log(userId, sessionId);
        if (login.homepageAuthentication("userId", sessionId)) {
            res.redirect('userhomepage.html')
        } else {
            res.send('You are not authorized to view this page');
        }
    }
});
router.get('/logout', (req, res) => {
    const sessionId = req.cookies.sessionId ? req.cookies.sessionId : false;
    if (sessionId) {
        const user = database.registered_users.find((user) => user.sessionId === sessionId);
        if (user) {
            const index = database.registered_users.indexOf(user);
            database.registered_users.splice(index, 1);
        }
    }
    res.clearCookie('sessionId').redirect('/');
})
router.get('/register', (req, res) => {
    // res.send("Sorry, this feature is not available right now")
    const username = req.query.username;
    const password = req.query.password;
    const email = req.query.email;
    // database.registered_users.filter((user) =>{user.username === username.length === 0 ? "" : res.send('Username is not available');    });
    // database.registered_users.filter((user) =>{user.email === email.length === 0 ? "" : res.send('Email is already registered');})
    try {

        const email = req.query.email;
        const mycookie = login.registerUser(username, password, email);
        console.log(mycookie);
        if (login.authenticateUser(username, password)) {
            const user = database.registered_users.find((user) => user.username === username && user.password === password);
            res.cookie('sessionId', user.username + "%" + user.sessionId, { maxAge: 50000, httpOnly: true }).redirect('/home');

        }
    } catch (error) {
        res.send('Something went wrong Please try again')
        console.log(error);

    }
});
router.get('/loginInterface', (req, res) => {
    if (req.cookies.sessionId) {
        res.redirect('/home');
    }

    res.redirect('/loginInterface.html');
})
router.get('/login', (req, res) => {
    console.log(req.query);

    try {
        const username = req.query.username;
        const password = req.query.password;
        if (login.authenticateUser(username, password)) {
            // const sessionId = login.generateSessionId()
            // const cookieValue = login.setCookie('sessionId', sessionId);
            // database.registered_users.filter((user) => user.username === username).length === 0 ? database.registered_users.push({ username, sessionId }) : database.registered_users;
            // console.log(database.registered_users)
            // console.log(cookieValue)
            const user = database.registered_users.find((user) => user.username === username && user.password === password);
            console.log('login successful')
            res.cookie('sessionId', user.username + "%" + user.sessionId, { maxAge: 50000, httpOnly: true }).redirect('/home');
            // res.setHeader('sessionId', user.username+"%"+user.sessionId).status(201).redirect('/home');
        }
        else {
            res.redirect('/wrongpassword.html').status(401)
        }
    } catch (error) {
        res.redirect('/loginInterface.html').status(400).send('Something went wrong Please try again')
        console.log(error);

    }
});

router.get('/api_ai/services',async(req, res)=>{
    const message = req.query.message;
    const response =await Ai.AI_req(message)
    console.log(response)
    res.json(response)
})
module.exports = router;