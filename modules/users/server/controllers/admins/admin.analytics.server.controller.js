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
