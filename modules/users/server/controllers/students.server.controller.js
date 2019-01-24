'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Student = mongoose.model('Student'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Student
 */

/*exports.getUpdates = function(req, res) {
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
};*/

exports.create = function(req, res) {
  console.log("create");
  var student = new Student(req.body);

  console.log("req.body: ",req.body);
  console.log("req.user: ",req.user);
  console.log("req.user: ",req.body.user);

  student.user = {
    _id: req.user._id
  };
  student.username = req.user.username;
  student.credentialId = req.body.credentialId;
  student.application.email = req.body.email;
  student.application.firstName = req.body.firstName;
  student.application.lastName = req.body.lastName;
  student.interviewer = [null, null, null];
  student.indivRanks = [null, null, null];
  student.interviewRank = [null, null, null];
  student.interviewerID = [null, null, null];
  student.mentor = null;
  student.mentorID = null;
  student.mentor_email = null;
  student.track = null;
  student.ResumeId = null;
  student.letterOfRecommendationId = null;
  student.WaiverId = null;
  student.NDAId = null;
  student.isLetterofRecommendationSubmitted = false;
  student.isLetterofRecommendationAdminApproved = false;
  student.isWaiverSubmitted = false;
  student.isWaiverAdminApproved = false;
  student.isNDASubmitted = false;
  student.isNDAAdminApproved = false;
  student.isResumeSubmitted = false;
  student.isResumeAdminApproved = false;
  student.isAppComplete = false;
  student.isFormSubmitted = false;
  student.areFormsAdminApproved = false;
  student.areFormsStudentApproved = false;
  student.active = true;

  student.save(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("STUDENT: ",student);
      res.json(student);
    }
  });
};

/**
 * Show the current Student
 */
exports.read = function(req, res) {
  console.log("read");
  // convert mongoose document to JSON
  var student = req.student ? req.student.toJSON() : {};

  console.log("student: ",student);

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  // student.isCurrentUserOwner = req.user && student.user && student.user._id.toString() === req.user._id.toString();

  res.json(student);
};

exports.getStudentByUsername = function(req, res){
  console.log("req.params.username: ", req.params.username);

  Student.findOne({username: req.params.username}).then(function(student){
    console.log("student: ",student);
    if(student === null){
      return res.status(200).send({
        message: "DNE"
      });
    }
    else{
      res.json(student);
    }
  }, function(err){
    if(err){
      return res.status(200).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

/**
 * Update a Student
 */
exports.update = function(req, res) {

  //var student = new Student(req.body);
console.log(req.body);
  //console.log("YOYO: ",student);

  Student.findOneAndUpdate({user: req.body.user}, req.body, {upsert: false}).then(function(data){
    console.log("YOYO DATA: ",data);

    res.json(data);
  })

};

/**
 * Delete an Student
 */
exports.delete = function(req, res) {
  console.log("delete");
/*  var student = req.student;

  student.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(student);
    }
  });*/
};




/**
 * List of Students
 */
exports.list = function(req, res) {
  Student.find({active: {$ne: false } }).sort('-created').populate('user', 'displayName').exec(function(err, students) {
    if (err) {
      console.log(err);
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      console.log("we are calling list");
      res.jsonp(students);
    }
  });
};

exports.listActive = function (req, res) {
  console.log("In server list all students");
  Student.find({active: true}).sort('-created').exec().then(function (students) {
      res.json(students);
  }, function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

exports.listActiveWithoutForms = function(req, res) {
  Student.find({active: true, isFormSubmitted: false}).sort('-created').exec().then(function (students) {
      res.json(students);
    }, function(err){
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      }
  });
};

exports.listDeactivated = function (req, res) {
  console.log("In server list all students");
  Student.find({active: false}).sort('-created').exec().then(function (students) {
      res.jsonp(students);
  }, function(err){
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
  });
};

exports.listNonActiveWithoutForms = function(req, res) {
  Student.find({active: false, isFormSubmitted: false}).sort('-created').exec().then(function (students) {
      res.json(students);
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

 exports.studentByID = function (req, res, next, id) {
   if (!mongoose.Types.ObjectId.isValid(id)) {
     return res.status(400).send({
       message: 'Student is invalid'
     });
   }

   Student.findOne({
     user: id
   }).exec(function (err, user) {
     if (err) {
       return next(err);
     } else if (!user) {
       return next(new Error('Failed to load User ' + id));
     }

     req.profile = user;
     next();
   });
 };

/*exports.studentByID = function(req, res, next, id) {
  console.log(id);

  if (id === "undefined") {
    id = req.user.id;
  }
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Student is invalid bo'
    });
  }

  Student.findById(id).populate('user', 'displayName').exec(function (err, student) {
    if (err) {
      return next(err);
    } else if (!student) {
      return res.status(404).send({
        message: 'No Student with that identifier has been found'
      });
    }
    req.student = student;
    next();
  });

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
};*/
