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
		firstName: {
			default: '',
			type: String
		},
		lastName: {
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
		},

		areaofexpertise: {
			default: '',
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
	username: {
		type: String
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
}, {
	usePushEach: true
});


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
