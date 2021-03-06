'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserReq = mongoose.model('UserReq'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

/**
 * Show the current user
 */
exports.readReq = function (req, res) {
  console.log(req);
  res.json(req);
};

/**
 * Update a User
 */
exports.updateReq = function (req, res) {
  console.log("req model: ",req.body);
  var userreq = req.body;
  console.log("server user: ",userreq);

  // For security purposes only merge these parameters
  userreq.firstName = req.body.firstName;
  userreq.lastName = req.body.lastName;
  userreq.email = req.body.email;
  userreq.roles = req.body.roles;

  console.log("roles: ",userreq.roles);

  UserReq.findOneAndUpdate({_id: userreq._id}, {$set:{roles: userreq.roles}}, {new: true}).then(function(data){
    console.log("data: ",data);
    res.json(data);
  })
  /*userreq.save(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(userreq);
  });*/
};

/**
 * Delete a userreq
 */
exports.deleteReq = function (req, res) {
  console.log("deleteReq: ",req.body);
  console.log("dR: ",req.query);
  UserReq.deleteOne({_id: req.query._id}).exec().then(function(response){
    console.log("response: ",response);
    res.json(response);
  });
};

/**
 * List of Users
 */
exports.listReq = function (req, res) {
  UserReq.find({}).sort('-created').exec(function (err, userreqs) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }
    else{

      return res.status(200).send({ userreqs });
      //await(object.users = users);

      //await(res.json(object));
    }
  });
};

/**
 * User middleware
 */
exports.userReqByID = function (req, res, next, id) {
  console.log("HERE");
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'UserReq is invalid'
    });
  }

  UserReq.findReqById(id).exec(function (err, userReq) {
    if (err) {
      return next(err);
    } else if (!userReq) {
      return next(new Error('Failed to load userreq ' + id));
    }

    req.model = userReq;
    next();
  });
};
