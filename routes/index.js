const express = require('express');
const router = express.Router();
const sql = require('mssql');
const storage = require('node-sessionstorage');

// Login Page
router.get('/', (req, res) => res.render('login'));
router.get('/login', (req, res) => res.render('login'));

// Login post
router.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password) {
      errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
      res.render('login', {
        errors,
        username,
        password
      });
    }
    else {
      var request = new sql.Request();
      request.query("SELECT username FROM Users WHERE username='" + username + "' and password='" + password + "'", function (err, recordset) {
        if (err) {
          req.flash(
            'error_msg',
            'Unable to connect to database. ' + err.message
          );
          res.redirect('/login');
        }
        else {
          if (recordset.recordsets != "") {
            console.log('User ' + username + ' successfully authenticated.');
            storage.setItem('authenticated', 'true');
            res.redirect('/contacts');
          }
          else {
            console.log('User ' + username + ' with password ' + password + ' failed to authenticate.');
            req.flash(
              'error_msg',
              'Incorrect username or password.'
            );
            storage.setItem('authenticated', 'false');
            res.redirect('/login');
          }
        }
      });
    }
  });
  
  // Logout
  router.get('/logout', (req, res) => {
    req.flash('success_msg', 'You are logged out');
    storage.setItem('authenticated', 'false');
    res.redirect('/login');
  });

module.exports = router;