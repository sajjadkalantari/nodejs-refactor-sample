const express = require('express');
const defects = require('../controllers/defect-controller');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(express.json());
  app.use('/api/defects', defects);
  app.use(error);
}