'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Admin = mongoose.model('Admin'),
  Student = mongoose.model('Student'),
  Volunteer = mongoose.model('Volunteer'),

  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');


/**
* Auto Functionality
*/

function chooseOneInterviewStudent(student,interviewer){
  var v;
  if(student.interviewer.length < 3){
    return new Promise(function(resolve,reject){
      Volunteer.find({ user: interviewer}).then(function(volunteers){
        if(volunteers.length === 0){
          resolve('No interviewers available!');
        }
        else{
        console.log("chooseInterviewerForStudent");
          v = volunteers[0];

          var v0 = false;

          // console.log(v);
          // console.log(student);
          // var compare = student.user;

          for(var i=0; i<v.intervieweeID.length; i++){

            if(v.intervieweeID[i] == student.user.toString()) {
              v0 = true;
              break;
            }
          }

          if(v0 === false){
            student.interviewer.push(v.application.name);
            student.interviewerID.push(v.user);

            v.interviewee_count = v.interviewee_count + 1;
            v.interviewee.push(student.application.name);
            v.intervieweeID.push(student.user);
          }

          student.save(function(err){
            if(err) console.log(err);
          }).then(function(response){
            v.save(function(err){
              if(err) console.log(err);
            }).then(function(response){
              resolve(student);
            })
          });
        }
      });
    });
  }
};

exports.chooseInterviewer = function(req, res){
      // console.log("thisis bad4");
  return new Promise(function(resolve, reject){

    Student.find({ user: req.params.studentId }).then(function(response){
      console.log("response rI: ",response[0]);

      var message = chooseOneInterviewStudent(response[0],req.params.mentorID);
      resolve(message);
    });
  }).then(function(message){
    res.jsonp(message);
  });
};

exports.replaceInterviewer = function(req, res){
  return new Promise(function(resolve, reject){

    Student.find({ user: req.params.studentId }).then(function(response){
      console.log("response rI: ",response[0]);

      var message = assignOneInterviewStudent(response[0], 2);
      resolve(message);
    });
  }).then(function(message){
    res.jsonp(message);
  });
};

function autoAssignInterviewsStudent(student, n){

    return new Promise(function(res, rej){
      Volunteer.find({roles: "interviewer", active: true}).sort({interviewee_count: 1}).exec().then(function(volunteers){
        console.log("volunteerslength: ",volunteers.length);
        console.log("volunteers: ",volunteers);
        if(volunteers.length > 0){
          console.log("A505");
        return new Promise(function(resolve, reject){
          student.indivRanks = [null, null, null];
          student.interviewRank = [null, null, null];
          if(n===3){
            student.interviewer = [volunteers[0].user, volunteers[1].user, volunteers[2].user];

          }
          else if(n==2){
             student.interviewer = [volunteers[0].user];
          }

          student.save(function(err){
            if(err) console.log(err);
          });

            var v0 = false;
            var v1 = false;
            //var v2 = false;

            for(var i=0; i<volunteers[0].interviewee.length; i++){
              if(volunteers[0].interviewee[i] === student.user) v0 = true;
            }
            /*for(var i=0; i<volunteers[1].interviewee.length; i++){
              if(volunteers[1].interviewee[i] === student.user) v1 = true;
            }*/
            if(n===3){
              for(var i=0; i<volunteers[2].interviewee.length; i++){
               if(volunteers[2].interviewee[i].user === student.user) v2 = true;
              }
            }

            if(v0 === false){
              volunteers[0].interviewee_count = volunteers[0].interviewee_count + 1;
              volunteers[0].interviewee.push(student.application.name);
              volunteers[0].intervieweeID.push(student.user);
            }
            /*if(v1 === false){
              volunteers[1].interviewee_count = volunteers[1].interviewee_count + 1;
              volunteers[1].interviewee.push(student.application.name);
              volunteers[1].intervieweeID.push(student.user);
            }
            if(n === 3 && v2 === false){
              volunteers[2].interviewee_count = volunteers[2].interviewee_count + 1;
              volunteers[2].interviewee.push(student.application.name);
              volunteers[2].intervieweeID.push(student.user);
            }*/

            resolve(volunteers);

        }).then(function(volunteers){
          console.log("student id: ", volunteers[2].intervieweeID);
            volunteers[0].save(function(err){
            if(err) console.log(err);
            });
            volunteers[1].save(function(err){
              if(err) console.log(err);
            });
		    /* Alex wants only 2 interviewers
            volunteers[2].save(function(err){
              if(err) console.log(err);
            });
		    */
              res('Success');
            });
          }
          else{
            console.log("A606");
              res('Not enough volunteers available to complete task');
          }

          });
      });

}; // end of interview assign function //

function clearInterviewData(){
  Volunteer.find({roles: 'interviewer', active: true}).exec().then(function(volunteers){
    if(volunteers.length > 0){
    volunteers.forEach(function(volunteer){
      return new Promise(function(resolve, reject){
        volunteer.interviewee = [];
        volunteer.intervieweeID = [];
        volunteer.interviewee_count = 0;

        resolve(volunteer);
      }).then(function(volunteer_updated){
        console.log(volunteer.interviewee);
        console.log(volunteer.intervieweeID);
        volunteer_updated.save();
      });
    });
  }
  });
};
/* method to clear all interviews
exports.clearData = function(req,res){
	clearInterviewData();
    return new Promise(function(resolve, reject){
    resolve('Success');
  }).then(function(message){
    console.log("A304");
    res.json(message);
  });
};
*/
/*
SUPER FUNCTION AUTO ASSIGN INTERVIEWSS
*/

function assignOneInterviewStudent(student, n, numInterviewers){
  var v;
  var v0;
  var v1;
    return new Promise(function(resolve,reject){
      Volunteer.find({ roles: "interviewer", active: true, user: { $nin: student.interviewerID } }).sort({interviewee_count: 1}).exec().then(function(volunteers){
        if(volunteers.length === 0){
          resolve('No interviewers available!');
        }
        else if(volunteers.length > 0 && volunteers.length < numInterviewers){
          v = volunteers[0];

          student.interviewerID[0] = v.user;
          student.interviewer[0] = `${v.application.firstName} ${v.application.lastName}`;

            v.interviewee_count = v.interviewee_count + 1;
            v.interviewee.push(student.application.firstName+" "+student.application.lastName);
            v.intervieweeID.push(student.user);

          Student.findOneAndUpdate({user: student.user}, student, {upsert: false}).then(function(response){
            Volunteer.findOneAndUpdate({user: v.user}, v, {upsert: false}).then(function(response){
              resolve(student);
            });
          });

        }
        else if(volunteers.length > 0 && volunteers.length >= numInterviewers){
          v0 = volunteers[0];
          student.interviewerID[0] = v0.user;
          student.interviewer[0] = `${v0.application.firstName} ${v0.application.lastName}`;
          
          if(volunteers.length >= 2){
            v1 = volunteers[1];
            student.interviewerID[1] = v1.user;
            student.interviewer[1] = `${v1.application.firstName} ${v1.application.lastName}`;
          }

            v0.interviewee_count = v0.interviewee_count + 1;
            v0.interviewee.push(student.application.firstName+" "+student.application.lastName);
            v0.intervieweeID.push(student.user);

            v1.interviewee_count = v1.interviewee_count + 1;
            v1.interviewee.push(student.application.firstName+" "+student.application.lastName);
            v1.intervieweeID.push(student.user);

            Student.findOneAndUpdate({user: student.user}, student, {upsert: false}).then(function(response){
              Volunteer.findOneAndUpdate({user: v0.user}, v0, {upsert: false}).then(function(response){
                Volunteer.findOneAndUpdate({user: v1.user}, v1, {upsert: false}).then(function(response){
                  resolve(student);
                });
              });
            });
        }
      });
    });
};

exports.autoAssignInterviews = function(req, res){
  clearInterviewData();
  Student.find({ active: true }).exec().then(function(students){
    return new Promise(function(resolve, reject){
      if(students.length > 0){
        return new Promise(function(rs, rj){

          //loop for synchronous events
          var loop = function(count){
            assignOneInterviewStudent(students[count], 2, 2).then(function(message){
              if(message === 'No interviewers available!'){
                resolve(message);
              }
              else{
                if(message.user !== undefined){
                  message.save();
                }
                count = count + 1;
                if(count < students.length) loop(count);
                else resolve(message);
              }
            });
            /*autoAssignInterviewsStudent(students[count], 2).then(function(message){
              if(message === 'Not enough volunteers available to complete task'){
                console.log("entered No Volunteers available")
                resolve(message);
              }
              else if(message !== 'No volunteers available' && count === students.length-1){
                resolve(message);
              }
              else{
                count = count + 1;

                loop(count);
              }
            });*/
          }

          loop(0);

        }).then(function(message){
          resolve(message);
        });
    }
    else{
      resolve('No Students');
    }
  }).then(function(message){
    res.json(message);
  });
  });
};

/*
MANUALLY ACCEPT FUNCTION
*/
exports.manAccept = function(req, res){

  Student.findOneAndUpdate({username: req.body.username }, req.body, {upsert: false}).exec().then(function(student){
    res.json({success: true, message: 'success'});
  }, function(err){
    res.json({success: false, message:err});
  });

};

exports.manMatch = function(req, res){
  var s;
  var m;
  console.log("in server manual match")
  Student.find({user: {_id: req.params.studentId} }).exec().then(function(student){
    s = student[0];
    Volunteer.find({  _id: req.params.mentorID  }).exec().then(function(mentor){
      return new Promise(function(resolve, reject){   
        for(var i=0; i < mentor[0].mentee.length; i++){
          if(s.application.name === mentor[0].mentee[i]){
            reject('Pair already matched');
          }
        }
        //Note: if the student already has a mentor 
        if(s.mentorID !== "" || s.mentor !== ""){
          reject('Pair already has a mentor');
        }
        m = mentor[0];
        s.mentor = mentor[0].application.name;
        s.mentorID = mentor[0].user;
        s.mentor_email = mentor[0].application.email;
        s.track = mentor[0].areaofexpertise;

        resolve(s);
      }).then(function(student){
        student.save(function(err){
          if(err) reject('Error saving student');
        }).then(function(student){
          return new Promise(function(rs, rj){
              m.mentee.push(student.application.name);
              m.menteeID.push(student.user);
              if(student.timeSlot[0] === "1") m.mentee_count_sess_1 = m.mentee_count_sess_1 + 1;
              else if(student.timeSlot[0] === "2") m.mentee_count_sess_2 = m.mentee_count_sess_2 + 1;
              else if(student.timeSlot[0] === "3") m.mentee_count_sess_3 = m.mentee_count_sess_3 + 1;
              rs(m);
          }).then(function(mentor){
            mentor.save(function(err){
              if(err) reject('Error saving mentor');
            }).then(res.json('Success'));
          });
        }, function(error){
          res.json('Unsuccessful');
        });
      }, function(error){
        res.json('Student already matched');
      });
    });
  });
};

exports.manUnassignInterview = function(req, res){
  console.log("WE IN DA HOUSE Y'ALL"); // wut @Sylvia - Logan
  var s;
  var i_length;
  Student.find({ user: req.params.studentId }).exec().then(function(student){
    console.log("student from find: ",student);
    return new Promise(function(resolve, reject){
      s = student[0];
      var v_ids = student[0].interviewerID;

      console.log("v_ids: ",v_ids);

      resolve(v_ids);
    });
  }).then(function(v_ids){
    return new Promise(function(resolve, reject){
      var v;
      var j = 0;
    v_ids.forEach(function(v_id){
      Volunteer.find( { user: v_id} ).exec().then(function(volunteer){
        v = volunteer[0];
        console.log("volunteer found: ",volunteer);
        console.log("v1: ",v);
        for(var i=0; i<v.intervieweeID.length; i++){
            console.log("v.intervieweeID.length", v.intervieweeID.length);
            console.log(s.user.toString());
            console.log(v.intervieweeID[i].toString());
            console.log(s.user.toString() === v.intervieweeID[i].toString());
            if(s.user.toString() === v.intervieweeID[i].toString()){
            console.log("OOPS HERE WE GO GIRL"); // lol
            j = j+1;
              v.interviewee_count = v.interviewee_count - 1;
              v.intervieweeID.splice(i, 1);
              v.interviewee.splice(i, 1);
              console.log("YO THE V IS: ",v); // yo

              v.save().then(function(volunteer){
                console.log("v_ids.length:",v_ids.length);
                console.log("j:", j);
                if(j===v_ids.length) resolve("finished");
              },function(err){
                if(err) console.log(err);

            });
          }
        }
      });
    });
    });
  }).then(function(message){
    res.jsonp(message);
  });
};


exports.manUnmatch = function(req, res){
  //pass student id and mentor id
  console.log("YO IN HERE 101");
  console.log("student: ",req.params.studentId);
  console.log("volunteer: ",req.params.mentorID);
  var updatedMentor = false;
  var s;
  var m;
  return new Promise(function(rs,rj){
  Student.find({ user: { _id: req.params.studentId} }).exec().then(function(student){
    s = student[0];
    return new Promise(function(resolve, reject){
      Volunteer.find({ user: req.params.mentorID }).exec().then(function(mentor){
        console.log("mentor retrieved: ",mentor);
        s.mentor = "";
        s.mentorID = "";
        s.mentor_email = "";
        s.track = "";

        m = mentor[0];
        for(var i = 0; i < m.mentee.length; i++){
          if(m.mentee[i] === s.application.name){
            m.mentee.splice(i, 1);
            m.menteeID.splice(i, 1);
            if(s.timeSlot[0] === "1") m.mentee_count_sess_1 = m.mentee_count_sess_1 - 1;
            else if (s.timeSlot[0] === "2") m.mentee_count_sess_2 = m.mentee_count_sess_2 - 1;
            else if (s.timeSlot[0] === "3") m.mentee_count_sess_3 = m.mentee_count_sess_3 - 1;
            updatedMentor = true;
          }
        }
        resolve(m);
      });
    }).then(function(mentor){
      if(updatedMentor === true){
        console.log("this is the issue");
      s.save(function(err){
        if(err) rj(err);
      }).then(function(student){
        res.jsonp(mentor);
        /*console.log("finished student: ",student);
        mentor.save(function(err){
          if(err) rj(err);
        }).then(function(mentor){
          res.jsonp(mentor);
        });*/
      });
    }
    else {
      rj('No update needed');
    }
  });
});
  });
};

function checkTimeSlotAvailability(session){
  return new Promise(function(resolve, reject){
    Volunteer.find( {sessions: session, roles: "mentor", active: true} ).count().then(function(v_count){
      console.log("v_count: ",v_count);
      Student.find({ timeSlot: session, active: true }).count().then(function(s_count){
        console.log("s_count: ",s_count);
        if((2*v_count)-s_count > 0){
          resolve(true);
        }
        else resolve(false);
      });
    });
  });
};

function autoAcceptStudent(student){

  return new Promise(function(resolve, reject){
    checkTimeSlotAvailability(student.application.preferredSession1).then(function(available1){
      if(available1 === true){
        return new Promise(function(rs, rj){
          student.timeSlot = student.application.preferredSession1;

          rs(student);
        }).then(function(student){
          student.save(function(err){
            if(err){
              return err;
            }
          }).then(function(student){
            resolve(student);
          });
        });
      }
      else {
        checkTimeSlotAvailability(student.application.preferredSession2).then(function(available2){
          if(available2 === true){
            return new Promise(function(rs, rj){
              student.timeSlot = student.application.preferredSession2;

              rs(student);
            }).then(function(student){
              student.save(function(err){
                if(err){
                  return err;
                }
              }).then(function(student){
                resolve(student);
              });
            });
          }
          else {
            checkTimeSlotAvailability(student.application.preferredSession3).then(function(available3){
              if(available3 === true){
                return new Promise(function(rs, rj){
                  student.timeSlot = student.application.preferredSession3;

                  rs(student);
                }).then(function(student){
                  student.save(function(err){
                    if(err){
                      return err;
                    }
                  }).then(function(stuent){
                    resolve(student);
                  });
                });
              }
              else {
                resolve('No space available.');
              }
            });
          }
        });
      }
    });
  });

};

exports.autoAcceptAllStudents = function(req, res){
    Student.find({ timeSlot: {$size: 0},  /*interviewRank: {$size: 1},*/ isAppComplete: true, areFormsAdminApproved: true, active: true }).sort({"interviewRank": -1}).exec().then(function(students){
      console.log("students: ",students);
      return new Promise(function(resolve, reject){
        if(students.length > 0){
          return new Promise(function(rs, rj){
            var loop = function(count){
              console.log("in loop");
              autoAcceptStudent(students[count]).then(function(message){
                console.log("message", message);
                if(count === students.length-1){
                  resolve(message);
                }
                else{
                  count = count + 1;
                  loop(count);
                }
              });
            }
            loop(0);
          }).then(function(message){
            resolve(message);
          });
      }
      resolve('Success');
    }).then(function(message){
      res.json(message);
    });
    });
};

function autoMatchStudent(s, m, m_count){
    return new Promise(async function(rs, rj){
      await (s.mentor = m.application.firstName + " " + m.application.lastName);
      await (s.mentorID = m.user);
      await (s.mentor_email = m.application.email);
      await (m.mentee.push(s.application.firstName + " " + s.application.lastName));
      await (m.menteeID.push(s.user));
      await (m[m_count] = m[m_count] + 1);
      rs([s, m]);
    }).then(function([s, m]){
      var a = Promise.resolve(s.save());
      var b = Promise.resolve(m.save());
      Promise.all([a,b]).then(async function([a,b]){
        console.log("a: ",a);
        console.log("b: ",b);
      });
    });
};

exports.autoMatch = function(req, res){
  console.log("req.body: ",req.body);
  return new Promise(async function(rs, rj){
    var mentee_count;

    if(req.params.sessionNum === "1") mentee_count = "mentee_count_sess_1";
    else if(req.params.sessionNum === "2") mentee_count = "mentee_count_sess_2";
    else if(req.params.sessionNum === "3") mentee_count = "mentee_count_sess_3";
    rs(await ([req.params.sessionNum, mentee_count]));
  }).then(function([session, m_count]){
      var ee_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Electrical Engineering / Design", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var me_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Mechanical Engineering / Design", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var sd_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Software Engineering Development", [m_count]: {$lt: 3}, active: true}).sort({[m_count]: 1}).exec());
      var ui_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Industrial / User Interface / Research Design", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var pm_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Program Management", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var ma_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Marketing", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var bu_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Business", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var lc_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", areaofexpertise: "Product Life Cycle Management", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
      var students = Promise.resolve(Student.find({"mentor": null, "active": true, "timeSlot.0": session}).sort().exec());

    Promise.all([ee_mentors, me_mentors, sd_mentors, ui_mentors, pm_mentors, ma_mentors, bu_mentors, lc_mentors, students]).then(async function([ee, me, sd, ui, pm, ma, bu, lc, s]){
      console.log("s: ", s);
      console.log(sd);
      var mentor_hashmap = {
        "Electrical Engineering / Design": ee,
        "Mechanical Engineering / Design": me,
        "Software Engineering Development": sd,
        "Industrial / User Interface / Research Design": ui,
        "Program Management": pm,
        "Marketing": ma,
        "Business": bu,
        "Product Life Cycle Management": lc
      }

      await (mentor_hashmap);
      var unmatched = [];

      if(s.length > 0){
          var loop = async function(count){
            console.log("student: ",s[count]);
            if(s[count].application.interests.length > 0){
              console.log("HERE");
            var matched;
            var m;
            console.log("mentor hashmap interest 0: ",mentor_hashmap[s[count].application.interests[0]]);
            console.log("mentor hashmap interest 1: ",mentor_hashmap[s[count].application.interests[1]]);
            console.log("mentor hashmap interest 2: ",mentor_hashmap[s[count].application.interests[2]]);
            if(mentor_hashmap[s[count].application.interests[0]] !== undefined && mentor_hashmap[s[count].application.interests[0]].length > 0){
              console.log("selected: ",mentor_hashmap[s[count].application.interests[0]][0]);
              await(m = mentor_hashmap[s[count].application.interests[0]][0]);
              await(mentor_hashmap[s[count].application.interests[0]].shift());
              matched = true;
              await(m);
              if(m[m_count] < 1){
                await(mentor_hashmap[s[count].application.interests[0]].push(m));
              }
            }
            else if(mentor_hashmap[s[count].application.interests[1]] !== undefined && mentor_hashmap[s[count].application.interests[1]].length > 0){
              console.log("selected: ",mentor_hashmap[s[count].application.interests[1]][0]);
              await(m = mentor_hashmap[s[count].application.interests[1]][0]);
              await(mentor_hashmap[s[count].application.interests[1]].shift());
              matched = true;
              await(m);
              if(m[m_count] < 1){
                await(mentor_hashmap[s[count].application.interests[1]].push(m));
              }
            }
            else if(mentor_hashmap[s[count].application.interests[2]] !== undefined && mentor_hashmap[s[count].application.interests[2]].length > 0){
              console.log("selected: ",mentor_hashmap[s[count].application.interests[2]][0]);
              await(m = mentor_hashmap[s[count].application.interests[2]][0]);
              await(mentor_hashmap[s[count].application.interests[2]].shift());
              matched = true;
              await(m);
              if(m[m_count] < 1){
                await(mentor_hashmap[s[count].application.interests[2]].push(m));
              }
            }
            else{
              await (unmatched.push(s[count]));
              matched = false;
            }
            await(m);
            await(mentor_hashmap);
            await(matched);
            if(matched === true){
              console.log("MATCHED = TRUE");
              await(autoMatchStudent(s[count], m, m_count));
            }
            if(count === s.length-1){
              return;
            }
            else{
              count = count + 1;
              loop(count);
            }
          }
    }
    await loop(0);
  }
  var all_mentors = Promise.resolve(Volunteer.find({sessions: session, roles: "mentor", [m_count]: {$lt: 2}, active: true}).sort({[m_count]: 1}).exec());
  Promise.all([all_mentors]).then(function([a]){
    if(unmatched !== undefined && unmatched.length > 0){
      var loop = async function(count){
        var m;
        if(a.length > 0){
          await(m = a[0]);
          console.log("m: ",m);
          await(autoMatchStudent(unmatched[count], m, m_count));
          if(count === unmatched.length-1){
            res.json('Success');
          }
          else{
            count = count+1;
            loop(count);
          }
        }
        else{
          res.json('Success');
        }
      }
      loop(0);
  }
    else{
      res.json('Success');
    }
  });
});

 });
};
/*
function autoMatchStudent(student){
  console.log("autoMatchStudent");
  var m;
  var s = student;
  var mentee_count;
  var mentorID;
  //var mentee_count_sess_1;
//  var mentee_count_sess_2;
//  var mentee_count_sess_3;
    return new Promise(function(rs, rj){
      if(s.timeSlot[0] === "1")mentee_count = "mentee_count_sess_1";
      else if(s.timeSlot[0] === "2") mentee_count = "mentee_count_sess_2";
      else if(s.timeSlot[0] === "3") mentee_count = "mentee_count_sess_3";

      rs(mentee_count);
    }).then(function(m_count){
      return new Promise(function(rs, rj){

      Volunteer.find({sessions: s.timeSlot[0], areaofexpertise: s.interests[0],
        roles: "mentor", [m_count]: {$lt: 2}, active: true }).sort({[m_count]: 1}).exec().then(function(mentors){
          return new Promise(function(resolve, reject){
            if(mentors.length > 0){
              m = mentors[0];
              m.mentee.push(s.application.name);
              m.menteeID.push(s.user);
              if(s.timeSlot[0] === "1") m.mentee_count_sess_1 = m.mentee_count_sess_1 + 1;
              else if(s.timeSlot[0] === "2") m.mentee_count_sess_2 = m.mentee_count_sess_2 + 1;
              else if(s.timeSlot[0] === "3") m.mentee_count_sess_3 = m.mentee_count_sess_3 + 1;
            //  m.mentee_count = m.mentee_count + 1;

              resolve(m);
            }
            else{
              Volunteer.find({sessions: s.timeSlot[0], areaofexpertise: {$in: s.interests},
                roles: "mentor", [m_count]: {$lt: 2}, active: true }).sort({[m_count]: 1}).exec().then(function(mentors2){
                  if(mentors2.length > 0){
                  m = mentors2[0];
                  m.mentee.push(s.application.name);
                  m.menteeID.push(s.user);
                  if(s.timeSlot[0] === "1") m.mentee_count_sess_1 = m.mentee_count_sess_1 + 1;
                  else if(s.timeSlot[0] === "2") m.mentee_count_sess_2 = m.mentee_count_sess_2 + 1;
                  else if(s.timeSlot[0] === "3") m.mentee_count_sess_3 = m.mentee_count_sess_3 + 1;

                  //m.mentee_count = m.mentee_count + 1;

                  resolve(m);
                  }
                  else{
                    reject('No mentors available');
                  }
              });
            }
          });
    }).then(function(mentor){
      return new Promise(function(resolve, reject){
        mentor.save(function(err){
          if(err){
            rs('Error saving mentor');
          }
        }).then(function(mentor){
          s.mentor = mentor.application.name;
          s.mentorID = mentor.user;
          s.mentor_email = mentor.application.email;
          s.track = mentor.areaofexpertise;

          resolve(s);
        });
      });
    }).then(function(student){
      return new Promise(function(resolve,reject){
          student.save(function(err){
            if(err){
              rs('Error saving student');
            }
          }).then(rs('Success'));
      });

      rs('Success');
    }, function(reason){
      console.log('No mentors available');
      rs(reason);
    });

  });
});
};

function autoMatchSession(sessionNum){
  console.log("autoMatchSession");
  return new Promise(function(rs, rj){
    Student.find({"mentor": "", "active": true, "timeSlot.0": sessionNum.toString()}).exec().then(function(students){
        return new Promise(function(resolve, reject){
      if(students.length > 0){
          var loop = function(count){
            autoMatchStudent(students[count]).then(function(message){
              if(count === students.length-1){
                rs(message);
              }
              else{
                count = count + 1;
                loop(count);
              }
            });
          }
          loop(0);
    }
    else rs('No students');
  });
  });
  });
};*/
/*
function autoMatchStudentRandom(student){
  console.log("autoMatchStudentRandom");
  var m;
  var s = student;
  var mentee_count;
  var mentorID;
  //var mentee_count_sess_1;
//  var mentee_count_sess_2;
//  var mentee_count_sess_3;
    return new Promise(function(rs, rj){
      if(s.timeSlot[0] === "1")mentee_count = "mentee_count_sess_1";
      else if(s.timeSlot[0] === "2") mentee_count = "mentee_count_sess_2";
      else if(s.timeSlot[0] === "3") mentee_count = "mentee_count_sess_3";

      rs(mentee_count);
    }).then(function(m_count){
      return new Promise(function(rs, rj){

      Volunteer.find({sessions: s.timeSlot[0], areaofexpertise: {$in: s.interests},
        roles: "mentor", [m_count]: {$lt: 2}, active: true }).sort({[m_count]: 1}).exec().then(function(mentors){
          return new Promise(function(resolve, reject){
            if(mentors.length > 0){
              m = mentors[0];
              m.mentee.push(s.application.name);
              m.menteeID.push(s.user);
              if(s.timeSlot[0] === "1") m.mentee_count_sess_1 = m.mentee_count_sess_1 + 1;
              else if(s.timeSlot[0] === "2") m.mentee_count_sess_2 = m.mentee_count_sess_2 + 1;
              else if(s.timeSlot[0] === "3") m.mentee_count_sess_3 = m.mentee_count_sess_3 + 1;
            //  m.mentee_count = m.mentee_count + 1;

              resolve(m);
            }
            else{
              Volunteer.find({sessions: s.timeSlot[0],
                roles: "mentor", [m_count]: {$lt: 2}, active: true }).sort({[m_count]: 1}).exec().then(function(mentors2){
                  if(mentors2.length > 0){
                  m = mentors2[0];
                  m.mentee.push(s.application.name);
                  m.menteeID.push(s.user);
                  if(s.timeSlot[0] === "1") m.mentee_count_sess_1 = m.mentee_count_sess_1 + 1;
                  else if(s.timeSlot[0] === "2") m.mentee_count_sess_2 = m.mentee_count_sess_2 + 1;
                  else if(s.timeSlot[0] === "3") m.mentee_count_sess_3 = m.mentee_count_sess_3 + 1;

                  //m.mentee_count = m.mentee_count + 1;

                  resolve(m);
                  }
                  else{
                    reject('No mentors available');
                  }
              });
            }
          });
    }).then(function(mentor){
      return new Promise(function(resolve, reject){
        mentor.save(function(err){
          if(err){
            rs('Error saving mentor');
          }
        }).then(function(mentor){
          s.mentor = mentor.application.name;
          s.mentorID = mentor.user;
          s.mentor_email = mentor.application.email;
          s.track = mentor.areaofexpertise;

          resolve(s);
        });
      });
    }).then(function(student){
      return new Promise(function(resolve,reject){
          student.save(function(err){
            if(err){
              rs('Error saving student');
            }
          }).then(rs('Success'));
      });

      rs('Success');
    }, function(reason){
      console.log('No mentors available');
      rs(reason);
    });

  });
});
};
*/
/*
function autoMatchSessionRandom(sessionNum){
  return new Promise(function(rs, rj){
    Student.find({"mentor": "", "active": true, "timeSlot.0": sessionNum.toString()}).exec().then(function(students){
        return new Promise(function(resolve, reject){
      if(students.length > 0){
          var loop = function(count){
            autoMatchStudentRandom(students[count]).then(function(message){
              if(count === students.length-1){
                rs(message);
              }
              else{
                count = count + 1;
                loop(count);
              }
            });
          }
          loop(0);
    }
    else rs('No students');
  });
  });
  });
};
*/
/*exports.autoMatch = function(req, res) {
  //  var sessionNum = req.params.sessionNum;
    autoMatchSession(1).then(function(message){
      console.log(message);
      autoMatchSession(2).then(function(message4){
        console.log(message4);
        autoMatchSession(3).then(function(message2){
          console.log(message2);
          autoMatchSessionRandom(1).then(function(message5){
            console.log(message5);
            autoMatchSessionRandom(2).then(function(message3){
              console.log(message3);
              autoMatchSessionRandom(3).then(function(message6){
                console.log(message6);
                res.json(message6);
             });
            });
          });
        });
      });

    });
};*/

/**
 * Admin middleware
 */
