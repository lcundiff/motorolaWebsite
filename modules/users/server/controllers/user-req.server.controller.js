'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  mongoose = require('mongoose'),
  UserReq = mongoose.model('UserReq'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));

  console.log('entered');

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
  console.log("YOYO");
  console.log("req model: ",req.model);
  /*var userreq = req.model;
  console.log("server user: ",userreq);

  // For security purposes only merge these parameters
  userreq.firstName = req.body.firstName;
  userreq.lastName = req.body.lastName;
  userreq.email = req.body.email;
  userreq.roles = req.body.roles;

  userreq.save(function (err) {
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
  console.log("dR: ", req);
/*  UserReq.deleteOne({username: req.body.username})
  var userreq = req.model;

  userreq.remove(function (err) {
    if (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    }

    res.json(userreq);
  });*/
};

/**
 * List of Users
 */
exports.listReq = function (req, res) {
  UserReq.find({}).sort('-created').exec(async function (err, userreqs) {
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
