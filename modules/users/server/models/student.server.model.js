'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Student Schema
 */
var StudentSchema = new Schema({
  credentialId: {
    type: String,
    required: 'Please create a credential for student and assign this field with credential ID'
  },
  application: {
    name: {
      type: String,
      default: '',
      required: 'Please fill Student name',
      trim: true
    },
    email: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      line_1: {
        type: String
      },
      line_2: {
        type: String
      },
      city: {
        type: String
      },
      state: {
        type: String
      },
      zipcode: {
        type: String
      }
    },
    school: {
      type: String
    },
    grade: {
      type: String
    },
    parent: {
      name: {
        type: String
      },
      email: {
        type: String
      },
      phone: {
        type: String
      }
    },
    preferredSession1: {
      type: String
    },
    preferredSession2: {
      type: String
    },

    preferredSession3: {
      type: String
    },
    classes: [],
    projects: [],
    clubs: [],
    professionalExperiences: [],
    volunteerExperiences: [],
    interests: [],
  },
  interviewer: [],
  interviewerID: [],
  interviewRank: [],
  indivRanks: [],

  letterOfRecommendationId : {
    type: String
  },

  WaiverId : {
    type: String
  },

  NDAId : {
    type: String
  },

  ResumeId : {
    type: String
  },

  isAppComplete : {
    type: Boolean
    //default: false,

  },

   isFormSubmitted:{
     type:Boolean,
     default:false
   },

   isLetterofRecommendationSubmitted:{
     type: Boolean,
     default:false
   },

   isNDASubmitted: {
      type:Boolean,
      default:false
   },

   isWaiverSubmitted: {
     type:Boolean,
     default:false
    },
  active: {
      type: Boolean,
      default: true,
      required: true
  },
  locationChoice: [],
  interviewForms: [],
  timeSlot: [],
  interests: [],
  forms: [],
  track: {
    type: String
  },
  mentor: {
    type: String
  },
  mentor_email: {
    type: String
  },
  mentorID: {
    type: String
  },
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

  signup_link: {
    type: String,
    default: ''
  }
}, { usePushEach: true });

var studentUpdates = new Schema({
  studentName: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  action: {
    type: String
  }
});

mongoose.model('studentUpdates', studentUpdates);
mongoose.model('Student', StudentSchema);
