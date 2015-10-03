'use strict';

var _ = require('lodash');
var Verse = require('./verse.model');

// Get list of verses
exports.index = function(req, res) {
  Verse.find(function (err, verses) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(verses);
  });
};

// Get a single verse
exports.show = function(req, res) {
  Verse.findById(req.params.id, function (err, verse) {
    if(err) { return handleError(res, err); }
    if(!verse) { return res.status(404).send('Not Found'); }
    return res.json(verse);
  });
};

// Creates a new verse in the DB.
exports.create = function(req, res) {
  Verse.create(req.body, function(err, verse) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(verse);
  });
};

// Updates an existing verse in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Verse.findById(req.params.id, function (err, verse) {
    if (err) { return handleError(res, err); }
    if(!verse) { return res.status(404).send('Not Found'); }
    var updated = _.merge(verse, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(verse);
    });
  });
};

// Deletes a verse from the DB.
exports.destroy = function(req, res) {
  Verse.findById(req.params.id, function (err, verse) {
    if(err) { return handleError(res, err); }
    if(!verse) { return res.status(404).send('Not Found'); }
    verse.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}