const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const restricted = require('../auth/restricted.js');

const usersRouter = require('../users/users-router.js');
const authRouter = require('../auth/auth-router.js');
const restrictedRouter = require('../auth/restricted-router.js');

const server = express();

const sessionConfig = {
  name: "strawberry",
  secret: "keep your secret safe",
  resave: false, // === if no changes , don't save again
  saveUninitialized: true, // === for GDPR compliance
  cookie: {
    maxAge: 1000 * 60, // === 1 minute
    secure: false, // === True for production
    httpOnly: true, // === Set true for security
  },
  store: new KnexSessionStore({
    knex: require('../database/dbConfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 30
  })
};

server.use(helmet());   // === protects headers
server.use(express.json());  // === makes put and post work by passing info as json
server.use(cors());  // === connects react app w CORS middleware
server.use(session(sessionConfig)); // === uses express session and sessionConfig object
server.use('/api/users', usersRouter);  
server.use('/api/auth', authRouter);
server.use('/api/restricted', restricted, restrictedRouter);


server.get('/', (req, res) => {
  res.send("She lives ?! 🤗");
});


module.exports = server;