const express = require('express');
const router = express.Router();
const isLoggedIn = require('../util').isLoggedIn;
const Pin = require('../models/pin');


// Index (All Pins)
router.get('/', (req, res) => {
//  console.log("req.useris "+ JSON.stringify(req.user));
 // res.locals.id= req.user._id;
  Pin.find({})
  .populate('_user')
    .exec((err, pins) => {
      if (err) throw err;
      
      if (req.user) {
        pins = pins.map(item => {
          item.iLike = item.likes.indexOf(req.user._id.toString()) !== -1;
          
          return item;
        });
      }
     console.log("pins are " +  ' ' + JSON.stringify(pins[1]))
      res.render('../views/index4.ejs', { pins });
    });
});


// Pins from one user
router.get('/pins/:userId', (req, res) => {
  Pin.find({ _user: req.params.userId })
    .populate('_user')
    .exec((err, pins) => {
      if (err) throw err;
      
      const isMine = req.user && req.user._id.toString() === req.params.userId;
      const owner = pins.length ? pins[0]._user.twitter.username : 'unknown';
      
      if (req.user && !isMine) {
        pins = pins.map(item => {
          item.iLike = item.likes.indexOf(req.user._id.toString()) !== -1;
          
          return item;
        });
      }
      
      res.render('pins.ejs', { pins, isMine, owner });
    });
});


// Pin
router.get('/pin/:pinId', (req, res) => res.render('pin.html'));
router.get('/pin/', (req, res) => res.render('modal-post-pin.html'));

router.post('/pin/add', isLoggedIn, (req, res) => {
  const newPin = new Pin({
    _user: req.user._id,
    url: req.body.url,
    caption: req.body.caption
  });
  
  newPin.save(err => {
    if (err) throw err;
    
    res.redirect('/pins/' + req.user._id);
  });
});

router.get('/pin/remove/:pinId', isLoggedIn, (req, res) => {
  Pin.findByIdAndRemove(req.params.pinId, (err, result) => {
    if (err) throw err;
    
    res.redirect('/pins/' + req.user._id);
  });
});
function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect('/login');
  }
}


// Export
module.exports = router;