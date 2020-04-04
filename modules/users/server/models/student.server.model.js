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
    //required: 'Please create a credential for student and assign this field with credential ID'
  },
  application: {
    firstName: {
      type: String,
      default: '',
      required: 'Please fill Student name',
      trim: true
    },
    lastName: {
      type: String,
      default: '',
      required: 'Please fill Student name',
      trim: true
    },
    email: {
	  type: String,
	  default: ''
      
    },
    phone: {
	  default: '',
      type: String
    },
    address: {
      line_1: {
		default: '',
        type: String
      },
      line_2: {
		default: '',
        type: String
      },
      city: {
		type: String,
		default: ''
      },
      state: {
		default: '',
        type: String
      },
      zipcode: {
		default: '',
        type: String
      }
    },
    school: {
      default: '',
      type: String
    },
    grade: {
      type: String
    },
    parent: {
      name: {
		default: '',
        type: String
      },
      email: {
		default: '',
        type: String
      },
      phone: {
		default: '',
        type: String
      }
    },
    emergency: {
      name: {
		default: '',
        type: String
      },
      email: {
		default: '',
        type: String
      },
      phone: {
		default: '',
        type: String
      },
      address: {
        line_1: {
	      default: '',
          type: String
        },
        line_2: {
		  default: '',
          type: String
        },
        city: {
		  default: '',
          type: String
        },
        state: {
		  default: '',
          type: String
        },
        zipcode: {
		  default: '',
          type: String
        }
      }
    },
    preferredSession1: {
	  default: '',
      type: String
    },
    preferredSession2: {
	  default: '',
      type: String
    },

    preferredSession3: {
      default: '',
      type: String
    },
    classes: [],
    projects: [],
    clubs: [],
    professionalExperiences: [],
    volunteerExperiences: [],
    interests: []
  },
  interviewer: [],
  interviewerID: [],
  interviewRank: [],
  indivRanks: [],

  letterOfRecommendationId : {
    type: String,
    default: null
  },

  WaiverId : {
    type: String,
    default: null
  },

  NDAId : {
    type: String,
    default: null
  },

  ResumeId : {
    type: String,
    default: null
  },

  isAppComplete : {
    type: Boolean,
    default: false,
    required: true
  },

   isFormSubmitted:{
     type:Boolean,
     default:false,
     required: true
   },

   areFormsAdminApproved:{
     type:Boolean,
     default:false,
     required: true
   },

   areFormsStudentApproved:{
     type:Boolean,
     default:false,
     required: true
   },

   isLetterofRecommendationAdminApproved: {
     type:Boolean,
     default:false,
     required: true
   },

   isLetterofRecommendationSubmitted:{
     type: Boolean,
     default:false,
     required: true
   },

   isNDASubmitted: {
      type:Boolean,
      default:false,
      required: true
   },

   isNDAAdminApproved: {
     type: Boolean,
     default: false,
     required: true
   },

   isResumeSubmitted: {
      type:Boolean,
      default:false,
      required: true
   },

   isResumeAdminApproved: {
     type: Boolean,
     default: false,
     required: true
   },

   isWaiverSubmitted: {
     type:Boolean,
     default:false,
     required: true
    },

    isWaiverAdminApproved: {
      type: Boolean,
      default: false,
      required: true
    },
  
  reminderCount: {
    type: Number,
    default: 0,
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
    type: String,
    default: null
  },
  mentor: {
    type: String,
    default: null
  },
  mentor_email: {
    type: String,
    default: null
  },
  mentorID: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  },
  profileImageURL: {
	default: '',
    type: String
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  username: {
    type: String,
    required: true
  },
  signup_link: {
    type: String,
    default: ''
  }
}, { usePushEach: true });

/*var studentUpdates = new Schema({
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
});*/
//mongoose.model('studentUpdates', studentUpdates);

mongoose.model('Student', StudentSchema);
mongoose.model('OldStudent', StudentSchema,'oldStudents');     // collection name
