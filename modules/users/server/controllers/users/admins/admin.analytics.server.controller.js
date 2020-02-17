'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Student = mongoose.model('Student'),
  Volunteer = mongoose.model('Volunteer'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
  
 
  exports.newStudentActivity = function(req, res) {
    const now = new Date();
    const weekStart= new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
    User.find({created: {$gte: weekStart}, roles: 'student'}, '-salt -password -providerData').sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else{
        console.log(users);
        res.status(200).send({users: users});
      }
    });
  };

  exports.newVolunteerActivity = function(req, res) {
    const now = new Date();
    const weekStart= new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
    User.find({created: {$gte: weekStart}, roles: 'volunteer'}, '-salt -password -providerData').sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else{
        console.log(users);
        res.status(200).send({users: users});
      }
    });
  };

  exports.newMentorActivity = function(req, res) {
    const now = new Date();
    const weekStart= new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
    User.find({created: {$gte: weekStart}, roles: 'mentor'}, '-salt -password -providerData').sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else{
        console.log(users);
        res.status(200).send({users: users});
      }
    });
  };

  exports.newInterviewerActivity = function(req, res) {
    const now = new Date();
    const weekStart= new Date(now.getFullYear(), now.getMonth(), now.getDate()-7);
    User.find({created: {$gte: weekStart}, roles: 'interviewer'}, '-salt -password -providerData').sort('-created').exec(function (err, users) {
      if (err) {
        return res.status(404).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
      else{
        console.log(users);
        res.status(200).send({users: users});
      }
    });
  };


  exports.completedStudentApps = function(req, res) {
    var allStudentApps = Student.count({}).exec();
    var completedStudentApps = Student.count({ isAppComplete: true}).exec();

    Promise.all([allStudentApps, completedStudentApps]).then(function(values){
      console.log("READY TO SEND");
      res.status(200).send({values: values});
    }).catch(function(err){
      res.status(400).send(err);
    });
  };

  exports.completedVolunteerApps = function(req, res) {
    var allVolunteerApps = Volunteer.count({}).exec();
    var completedVolunteerApps = Volunteer.count({ isAppComplete: true}).exec();

    Promise.all([allVolunteerApps, completedVolunteerApps]).then(function(values){
      console.log("READY TO SEND");
      res.status(200).send({values: values});
    }).catch(function(err){
      res.status(400).send(err);
    });
  };

  exports.completedStudentForms = function(req, res){
    var notCompletedStudentApps = Student.count({ areFormsStudentApproved: false, areFormsAdminApproved: false }).exec();
    var onlyStudentApproved = Student.count({ areFormsStudentApproved: true, areFormsAdminApproved: false }).exec();
    var adminApproved = Student.count({ areFormsAdminApproved: true }).exec();

    Promise.all([notCompletedStudentApps, onlyStudentApproved, adminApproved ]).then(function(values){
      res.status(200).send({values: values});
    }).catch(function(err){
      res.status(400).send(err);
    });
  };
