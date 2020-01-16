const express = require('express');
const router = express.Router();
const sql = require('mssql');
const storage = require('node-sessionstorage');
const config = require('../config/keys').sqlConfig;
const ensureAuthenticated = require('../config/auth.js');

// Create new contact page
router.get('/newcontact', ensureAuthenticated, (req, res) => res.render('newcontact'));

// Contacts page
router.get('/', ensureAuthenticated, (req, res) => {
  var request = new sql.Request();
  request.query("SELECT * FROM Contacts ORDER BY contactName ASC", function (err, recordset) {
    if (err) throw err;
    
    res.render('allcontacts', {listResults: recordset, display: storage.getItem('display')}); 
  });
});

// Contacts post
router.post('/', ensureAuthenticated, (req, res) => {
  let display = req.body.display;

  //update key for how many contacts to display
  storage.setItem('display', display);

  res.redirect('/contacts');
});

// Delete contact by ID
router.get('/delete/:id', ensureAuthenticated, (req, res) => { 
  let contactId = req.params.id;
  var request = new sql.Request();
  request.query("DELETE FROM Contacts WHERE contactId='" + contactId + "'", function (err, recordset) {
    if (err) throw err;

    if (recordset.rowsAffected > 0)
      console.log("deleted contactId: " + contactId);

    res.redirect('/contacts');
  });
});

// Create new contact post
router.post('/newcontact', ensureAuthenticated, (req, res) => {
  const { name, email, phone } = req.body;
  let errors = [];

  if (!name || !email || !phone) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('newcontact', {
      errors,
      name,
      email,
      phone
    });
  } else {
      var request = new sql.Request();
      request.query("INSERT INTO Contacts (contactName, contactEmail, contactPhone) VALUES ('" + name + "', '" + email + "','" + phone + "')",function (err, recordset) {
        if (err) throw err;
        req.flash(
          'success_msg',
          'New contact successfully created.'
        );
        res.redirect('/contacts');        
      });
  }
});

module.exports = router;