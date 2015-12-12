/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Verse = require('./verse.model');

exports.register = function(socket) {
  Verse.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Verse.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('verse:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('verse:remove', doc);
}