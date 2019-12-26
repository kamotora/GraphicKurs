var express = require('express');
var audioCtrl = express.Router();

audioCtrl.get('/waveform', function(req, res, next) {
  res.render('waveform',{ title: 'Wave'});
});


audioCtrl.get('/', function(req, res, next) {
  res.render('spiral',{ title: 'SPIRAL'});
});

module.exports = audioCtrl;
