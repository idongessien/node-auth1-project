const router = require('express').Router();
const bcrypt = require('bcryptjs');

const Users = require('../users/usersModel.js');
const restricted = require('./restricted.js');


router.post('/register', (req, res) => {
    let user = req.body;
    //hash the password
    const hash = bcrypt.hashSync(user.password, 14); // === password gets hashed 2 ^ 14 times
    user.password = hash;
  
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });
  
  router.post('/login', (req, res) => {
    let { username, password } = req.body;
   
    Users.findBy({ username })
      .first()
      .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
          req.session.username = user.username;
          res.status(200).json({ message: `Welcome ${ user.username }, cookiess !` });
        } else {
          res.status(401).json({ message: 'You shall not pass!' });
        }
      })
      .catch(error => {
        res.status(500).json(error);
      });
  });

  router.delete('/', (req, res) => {
    if(req.session) {
      req.session.destroy();
      res.status(200).json({ message: "You are logged out!" })
    }
  });

module.exports = router;