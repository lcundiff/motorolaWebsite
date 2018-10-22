'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
  //StudentModels = require('../../../students/server/models/student.server.model.js'),
  //VolunteerModels = require('../../../volunteers/server/models/volunteer.server.model.js');

/**
 * Admin Schema
 */
var AdminSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Admin name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  signup_link: {
    type: String,
    default: ''
  }
});

mongoose.model('Admin', AdminSchema);
