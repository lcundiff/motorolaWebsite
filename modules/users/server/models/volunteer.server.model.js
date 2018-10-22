'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Volunteer Schema
 */
var VolunteerSchema = new Schema({

  credentialId: {
    type: String,
    required: 'Please create a credential for volunteer and assign this field with credential ID'
  },
  isAppComplete: {
    type: Boolean,
    default: false,
    required: true
  },
  mentee: [],
  mentee_count_sess_1: Number,
  mentee_count_sess_2: Number,
  mentee_count_sess_3: Number,
  menteeID: [],
  interviewee: [],
  intervieweeID: [],
  interviewee_count: Number,

  application: {
    name: {
      type: String,
      default: '',
      required: 'Please fill Volunteer name',
      trim: true
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },

    areaofexpertise: {
      type: String
    },
    sessions: [],
    roles: []
  },

  sessions: [],
  areaofexpertise: {
    type: String
  },
  roles: [],
  created: {
    type: Date,
    default: Date.now
  },
  profileImageURL: {
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  active: {
    type: Boolean,
    default: true,
    required: true
  },
  signup_link: {
    type: String,
    default: ''
  }
}, { usePushEach: true });


// var VolunteerUpdates = new Schema({
//   volunteerName: {
//       type:String
//   },

//   date:{
//     type:Date,
//     default:Date.now
//   }

//   action:{
//     type:String
//   }

// });



mongoose.model('Volunteer', VolunteerSchema);
//mongoose.model('VolunteerUpdates',volunteerUpdates);
