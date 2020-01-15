const storage = require('node-sessionstorage');

module.exports = function(req, res, next) {
   if (storage.getItem('authenticated') == 'true') {
      next();
   }
   else {
      console.log('User is unauthorized.');
      req.flash('error_msg', 'Please log in to view this resource');
      res.redirect('/login');
   }
}