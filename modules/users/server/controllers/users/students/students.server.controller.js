'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  Update = mongoose.model('studentUpdates'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Student
 */

exports.getUpdates = function(req, res) {
  Update.find().sort('-date').exec(function(err, updates) {

    console.log("here");
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(updates);
    }
  });
};

exports.create = function(req, res) {
  var student = new Student(req.body);

  student.user = req.user;
  student.credentialId = req.body.credentialId;
  student.application = req.body.application;
  student.application.address = req.body.application.address;
  student.application.parent = req.body.application.parent;
  student.locationChoice = req.body.locationChoice;
  student.interviewForms = req.body.interviewForms;
  student.timeSlots = req.body.timeSlots;
  student.isAppComplete = req.body.isAppComplete;
   student.isFormSubmitted = req.body.isFormSubmitted;
  student.isLetterofRecommendationSubmitted = req.body.isLetterofRecommendationSubmitted;
  student.interests = req.body.interests;
  student.mentor = req.body.mentor;
  student.mentorID = req.body.mentorID;
  student.indivRanks = req.body.indivRanks;
  student.NDAId = req.body.NDAId;
  student.WaiverId = req.body.WaiverId;
  student.letterOfRecommendationId = req.body.letterOfRecommendationId;
  student.resumeId = req.body.resumeId;

  student.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var update = new Update;
      update.studentName = req.body.application.name;
      update.action = "Created a resume profile.";

      update.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
      res.jsonp(student);
    }
  });
};

/**
 * Show the current Student
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var student = req.student ? req.student.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // student.isCurrentUserOwner = req.user && student.user && student.user._id.toString() === req.user._id.toString();

  res.jsonp(student);
};

/**
 * Update a Student
 */
exports.update = function(req, res) {
  var student = req.student;

  //student = _.extend(student, req.body);

  //console.log(student);

  student.credentialId = req.body.credentialId;
  student.application = req.body.application;
  student.application.address = req.body.application.address;
  student.application.parent = req.body.application.parent;
  student.locationChoice = req.body.locationChoice;
  student.interviewForms = req.body.interviewForms;
  student.timeSlot = req.body.timeSlot;
  student.isAppComplete = req.body.isAppComplete;
  student.isFormSubmitted = req.body.isFormSubmitted;
  student.isLetterofRecommendationSubmitted = req.body.isLetterofRecommendationSubmitted;
  student.isWaiverSubmitted = req.body.isWaiverSubmitted;
  student.isNDASubmitted = req.body.isNDASubmitted;
  student.active = req.body.active;

  student.interests = req.body.interests;
  student.mentor = req.body.mentor;
  student.mentorID = req.body.mentor;
  student.mentor_email = req.body.mentor;
  student.track = req.body.mentor;
  student.forms = req.body.forms;
  student.interviewRank = req.body.interviewRank;
  student.interviewer = req.body.interviewer;
  student.interviewerID = req.body.interviewerID;
  student.indivRanks = req.body.indivRanks;

  student.NDAId = req.body.NDAId;
  student.WaiverId = req.body.WaiverId;
  student.letterOfRecommendationId = req.body.letterOfRecommendationId;

  console.log("req.body.active: ",req.body.active);


  student.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      var update = new Update;
      update.studentName = req.body.application.name;
      update.action = "Updated a resume profile.";
      update.save(function(err) {
        if (err) {
          return res.status(400).send({
            message: errorHandler.getErrorMessage(err)
          });
        }
      });
      Student.findOneAndUpdate({
        _id: req.user._id
      }, {
        interviewRank: req.body.interviewRank
      });
      res.jsonp(student);
    }
  });
};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
  var student = req.student;

  student.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });
};




/**
 * List of Students
 */
exports.list = function(req, res) {
  Student.find({active: {$ne: false } }).sort('-created').populate('user', 'displayName').exec(function(err, students) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("we are calling list");
      res.jsonp(students);
    }
  });
};

exports.listDeactivated = function (req, res) {
  console.log("In server list all students");
  Student.find({active: false}).sort('-created').populate('user', 'displayName').exec().then(function (students) {
      res.jsonp(students);
  }, function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

exports.listAccepted = function(req, res) {
  Student.find({ timeSlot: {$size: 1}, mentor: {$ne: ""} } ).sort('-created').populate('user', 'displayName').exec().then(function (students) {
      res.jsonp(students);
  }, function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
}


/**
 * Student middleware
 */

 exports.studentByStudentID = function(req, res){
     Student.find({ _id: req.params.studentId }).exec().then(function(response){
       var student = response[0];
       console.log("A12: ", response);

       res.jsonp(response[0]);
   });
 };

exports.studentByID = function(req, res, next, id) {
  console.log(id);

  if (id === "undefined") {
    id = req.user.id;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Student is invalid bo'
    });
  }

  /*Student.findById(id).populate('user', 'displayName').exec(function (err, student) {
    if (err) {
      return next(err);
    } else if (!student) {
      return res.status(404).send({
        message: 'No Student with that identifier has been found'
      });
    }
    req.student = student;
    next();
  });*/

  Student.findOne({
    'user': id
  }).exec(function(err, student) {
    console.log(id);
    if (err) {
      console.log(err);
      return next(err);
    } else {
      //console.log(student);
      req.student = student;
      next();
    }
  });
};
