'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create an Admin
 */
exports.create = function(req, res) {
  var admin = new Admin(req.body);
  admin.user = req.user;

  admin.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admin);
    }
  });
};

/**
 * Show the current Admin
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var admin = req.admin ? req.admin.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  admin.isCurrentUserOwner = req.user && admin.user && admin.user._id.toString() === req.user._id.toString();

  res.jsonp(admin);
};

/**
 * Update a Admin
 */
exports.update = function(req, res) {
  var admin = req.admin;

  admin = _.extend(admin, req.body);

  admin.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admin);
    }
  });
};

/**
 * Delete an Admin
 */
exports.delete = function(req, res) {
  var admin = req.admin;

  admin.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admin);
    }
  });
};

/**
 * List of Admins
 */
exports.list = function(req, res) {
  Admin.find().sort('-created').populate('user', 'displayName').exec(function(err, admins) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(admins);
    }
  });
};

/**
* Auto Functionality
*/

/*function autoMatchPerSession(studentSessionList, sessionNum, res){
  var s = studentSessionList;
  var sess = sessionNum;

  for(var i=0; i<s.length; s++){
    var topics;
    for(var j=0; j<s[i].interests.length; j++){
      topics.push(s[i].interests[j]);
    }

    var mentorList = Volunteer.find({ 'sessions': {$all: [sess]},
      'application.areaofexpertise': {$in: [topics]},
      'application.roles': {$all: ['mentor']}}).sort({'mentee_count': 1});

    if(mentorList.length === 0){
      mentorList = Volunteer.find({ 'sessions': {$all: [sess]},
        'application.roles': {$all: ['mentor']}}).sort({'mentee_count':1});
    }

    s[i].mentor = mentorList[0].application.name;
    mentorList[0].mentee.push(s[i]);
    mentorList[0].mentee_count = mentorList[0].mentee_count + 1;

    Student(s[i]).save(function(err){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(s[i]);
      }
    });

    Volunteer(mentorList[0]).save(function(err){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(mentorList[0]);
      }
    });
  }
};

exports.autoMatch = function(req, res) {
  var res;
  var studentList1 = Student.find({ 'timeSlot.0': 1, 'mentor':""}).sort({ 'interviewRank.0': -1});
  autoMatchPerSession(studentList1, 1, res);
  var studentList2 = Student.find({ 'timeSlot.0': 2, 'mentor':""}).sort({ 'interviewRank.0': -1});
  autoMatchPerSession(studentList2, 2, res);
  var studentList3 = Student.find({ 'timeSlot.0': 3, 'mentor':""}).sort({ 'interviewRank.0': -1});
  autoMatchPerSession(studentList3, 3, res);
};*/

/**
 * Admin middleware
 */
exports.adminByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Admin is invalid'
    });
  }

  Admin.findById(id).populate('user', 'displayName').exec(function(err, admin) {
    if (err) {
      return next(err);
    } else if (!admin) {
      return res.status(404).send({
        message: 'No Admin with that identifier has been found'
      });
    }
    req.admin = admin;
    next();
  });
};
