(function () {
	'use strict';

	// Admins controller
	angular
		.module('users')
		.controller('ApplicantsAdminsController', ApplicantsAdminsController);

	ApplicantsAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService', 'GoogleCloudService', /* 'AutomateService', 'googleDriveService',*/ '$http', '$sce'];

	function ApplicantsAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService, GoogleCloudService, /*AutomateService, googleDriveService,*/ $http, $sce) {
		var vm = this;
		vm.loading = false;
		vm.buildPager = buildPager;
		vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
		vm.pageChanged = pageChanged;
		vm.selected_user = false;

		vm.students;
		// APPLICANTS
		vm.listActiveStudents = listActiveStudents;
		vm.listDeactivatedStudents = listDeactivatedStudents;
		vm.listOldStudents = listOldStudents;
		vm.deactivateStudent = deactivateStudent;
		vm.activateStudent = activateStudent;
		vm.manAcceptStudent = manAcceptStudent;
		vm.displayStudent = displayStudent;
		vm.viewForm = viewForm;
		vm.manAcceptStudent = manAcceptStudent;
		vm.autoAccept = autoAccept;
		vm.updateOneField = updateOneField;
		vm.sendFormFixStudent = sendFormFixStudent;

		// FORMS
		vm.viewForm = viewForm;
		vm.sendFormFixEmail = sendFormFixEmail;
		vm.approveLetterOfRecommendation = approveLetterOfRecommendation;
		vm.approveResume = approveResume;
		vm.approveWaiver = approveWaiver;
		vm.approveNDA = approveNDA;
		vm.selectedNDAToUpload = '';
		vm.selectedWaiverToUpload = '';
		vm.uploadNDA = uploadNDA;
		vm.uploadWaiver = uploadWaiver;

		vm.displayUser = displayUser;

		vm.selected_user = false;

		$scope.fileNameChangedNDA = fileNameChangedNDA;
		$scope.fileNameChangedWaiver = fileNameChangedWaiver;

		function buildPager() {
			//console.log("HERE IN BP");
			vm.pagedItems = [];
			vm.itemsPerPage = 15;
			vm.currentPage = 1;
			vm.figureOutItemsToDisplay();
		}

		function displayStudent(user) {
			vm.user = user;
			console.log(user.timeSlot.length);
			if (user.timeSlot === []) vm.sessionType = "";
			else vm.sessionType = user.timeSlot[0];

			console.log("vm.user:", vm.user);

			vm.selected_user = true;
		}
		function sendFormFixStudent(student){
			console.log("Sending a fix form reminder to ", student.application.firstName);
			AdminService.sendUnapprovedReminder([student]).then(function(res){
				console.log("Send Unnaproved Form  Res: ",res)
				Notification.success({message: '<i class="glyphicon glyphicon-ok"></i>Unnaproved Forms Email Sent.'});				

				student.reminderCount = student.reminderCount + 1
				StudentService.updateStudent(student.user, student).then(function(res){console.log("Update user reminder count res: ",res);})
				.catch(function(err){console.log("Error updating student reminder count");});
				
			}).catch(function(err){
				console.log("Err: ",err)
				Notification.error({message: 'Error Trying To Send Emails.'});
			})
			console.log("After admin service")
		}
		// this is redundant
		function displayUser(user) {
			vm.user = user;
			vm.selected_user = true;
		}
		// function to change one field using [] to access JSON field
		/* @params
		/ @student => student (vm.user) object sent from view 
		/ @key => the field you want to change
		/ @val => the value you want to assign to field
		*/
		function updateOneField(student, key, val) {
			//console.log(typeof key);
			vm.user = student;
			vm.user[key] = val;
			console.log(key + " is key and value is " + vm.user[key]);
			StudentService.updateStudent(student.user, student).then((res) => {
				console.log("field updated: " + vm.user['phoneInterview']); // change phone interview boolean       
			});
		}
		function completedStudentApps() {
			AdminService.completedStudentApps().then(function (response) {
				const notCompleted = response.values[0] - response.values[1];
				const Completed = response.values[1];

				vm.completedStudentAppsGraph.data = [Completed, notCompleted];
			});
		}
		function autoAccept() {
			vm.loading = true;
			AdminService.autoAccept()
				.then(onAutoAcceptSuccess)
				.catch(onAutoAcceptError);
		}

		function onAutoAcceptSuccess(response) {
			vm.selected_user = false;
			vm.listActiveStudents();
			vm.loading = false;
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> Students have been automatically accepted into the program.'
			});
		}

		function onAutoAcceptError(response) {
			vm.loading = false;
			Notification.error({
				message: 'There was an error when auto-accepting students into the program.',
				title: '<i class="glyphicon glyphicon-remove"></i> Error',
				delay: 6000
			});

		}

		// download pdf form
		function viewForm(fileId) {
			if (fileId === null || fileId === '' || fileId === undefined) {
				Notification.error({
					message: 'Student has not yet uploaded this form.',
					title: '<i class="glyphicon glyphicon-remove"></i> Error',
					delay: 6000
				});
				return;
			}

			vm.loading = true;

			GoogleCloudService.downloadForm(fileId)
				.then(function (response) {
					var file = new Blob([response.data], {
						type: 'application/pdf'
					});
					$scope.fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
					var link = document.createElement('a');
					link.href = $scope.fileUrl;
					link.download = fileId;
					link.click();
					vm.loading = false;
				})
				.catch(onErrorGoogleCloudDownload);
		}

		function onErrorGoogleCloudDownload() {
			vm.loading = false;
			Notification.error({
				message: 'There was an error downloading this document from Google Cloud.',
				title: '<i class="glyphicon glyphicon-remove"></i> Error',
				delay: 6000
			});
		}

		//Modal Functions

		$scope.openModalCSV = function (docId) {
			var modal = document.getElementById(docId);
			modal.style.display = "block";
		};

		$scope.closeModalCSV = function (docId) {
			var modal = document.getElementById(docId);
			modal.style.display = "none";
		};
		$scope.checkAll = function (docId) {
			var value = $scope.all
			console.log("Checked all ", value)
			if (value !== undefined) {
				if (docId == 'myModalAllStudentCSV') {
					vm.form_name = value; vm.form_email = value; vm.form_phone = value; vm.form_address = value;
					vm.form_school = value; vm.form_parent_name = value; vm.form_parent_phone = value; vm.form_parent_email = value;
					vm.form_interviewers = value; vm.form_interview_date = value; vm.form_interview_time = value; vm.form_interview_dow = value;
				}
				else if (docId == 'myModalActiveStudentCSV') {
					vm.form_name = value; vm.form_email = value; vm.form_phone = value; vm.form_address = value;
					vm.form_school = value; vm.form_parent_name = value; vm.form_parent_phone = value; vm.form_parent_email = value;
					vm.form_interviewers = value; vm.form_mentor=value; vm.form_session=value; vm.form_top_interest=value;
					 vm.form_interview_date = value; vm.form_interview_time = value; vm.form_interview_dow = value;
				}
				else if (docId == 'myModalVolunteersCSV') {
					vm.form_name = value; vm.form_email = value; vm.form_phone = value; vm.form_address = value;
					vm.form_expertise=value; vm.form_sessions=value; vm.form_roles=value; vm.form_amount_of_interviews=value;
					vm.form_interviewees=value;
				}
				else{
					console.log("Document ID is not correct")
				}
			}

		}

		$scope.submitCSVForm = function (docId) {
			let columns = []

			if (vm.form_name !== undefined) {
				vm.form_name === true ? columns.push('Name') : "";
			}
			if (vm.form_email !== undefined) {
				vm.form_email === true ? columns.push('Email') : "";
			}
			if (vm.form_phone !== undefined) {
				vm.form_phone === true ? columns.push('Phone') : "";
			}
			if (vm.form_address !== undefined) {
				vm.form_address === true ? columns.push('Address') : "";
			}
			if (vm.form_school !== undefined) {
				vm.form_school === true ? columns.push('School') : "";
			}
			if (vm.form_parent_name !== undefined) {
				vm.form_parent_name === true ? columns.push('Parent Name') : "";
			}
			if (vm.form_parent_phone !== undefined) {
				vm.form_parent_phone === true ? columns.push('Parent Phone') : "";
			}
			if (vm.form_parent_email !== undefined) {
				vm.form_parent_email === true ? columns.push('Parent Email') : "";
			}
			if (vm.form_interviewers !== undefined) {
				vm.form_interviewers === true ? columns.push('Interviewers') : "";
			}
			if (vm.form_interview_date !== undefined) {
				vm.form_interview_date === true ? columns.push('Interview Date') : "";
			}
			if (vm.form_interview_time !== undefined) {
				vm.form_interview_time === true ? columns.push('Interview Time') : "";
			}
			if (vm.form_interview_dow !== undefined) {
				vm.form_interview_dow === true ? columns.push('Interview DOW') : "";
			}
			if (vm.form_mentor !== undefined) {
				vm.form_mentor === true ? columns.push('Mentor') : "";
			}
			if (vm.form_top_interest !== undefined) {
				vm.form_top_interest === true ? columns.push('Top Interest') : "";
			}
			if (vm.form_session !== undefined) {
				vm.form_session === true ? columns.push('Session') : "";
			}
			if (vm.form_expertise !== undefined) {
				vm.form_expertise === true ? columns.push('Expertise') : "";
			}
			if (vm.form_roles !== undefined) {
				vm.form_roles === true ? columns.push('Roles') : "";
			}
			if (vm.form_amount_of_interviews !== undefined) {
				vm.form_amount_of_interviews === true ? columns.push('Amount of Interviews') : "";
			}
			if (vm.form_interviewees !== undefined) {
				vm.form_interviewees === true ? columns.push('Interviewees') : "";
			}

			if (docId === 'myModalAllStudentCSV') {
				downloadAllCSV(columns)
			}
			if (docId === 'myModalActiveStudentCSV') {
				downloadActiveCSV(columns)
			}
			if (docId === 'myModalVolunteersCSV') {
				downloadVolunteersCSV(columns)
			}

			var modal = document.getElementById(docId);
			modal.style.display = "none";

		}
		function putColsInString(columns) {
			var str = " ";
			var i;
			for (i in columns) {
				str = str.concat(columns[i])
				if (i < (columns.length - 1)) {
					str = str.concat(', ');
				}
			}
			str = str.concat('\n');
			console.log('str ', str);
			return str;
		}

		function putColsInCSVFormat(columns, obj) {
			var content = ""
			var i;
			for (i in columns) {
				if (columns[i] === 'Name') {
					content = content.concat("\"", obj.application.firstName, " ", obj.application.lastName, "\"")
				}
				else if (columns[i] === 'Email') {
					content = content.concat("\"", obj.application.email, "\"")
				}
				else if (columns[i] === 'Phone') {
					content = content.concat("\"", obj.application.phone, "\"")
				}
				else if (columns[i] === 'Address') {
					if (obj.application.address.city !== "" && obj.application.address.state !== "" && obj.application.address.zipcode !== "") {
						content = content.concat("\"", obj.application.address.city, " , " + obj.application.address.state, " , " + obj.application.address.zipcode, "\"")
					}
					else {
						content = content.concat("\"", 'Not Available', "\"")
					}
				}
				else if (columns[i] === 'School') {
					content = content.concat("\"", obj.application.school, "\"")
				}
				else if (columns[i] === 'Parent Name') {
					content = content.concat("\"", obj.application.parent.name, "\"")
				}
				else if (columns[i] === 'Parent Phone') {
					content = content.concat("\"", obj.application.parent.phone, "\"")
				}
				else if (columns[i] === 'Parent Email') {
					content = content.concat("\"", obj.application.parent.email, "\"")
				}
				else if (columns[i] === 'Mentor') {
					content = content.concat("\"", obj.mentor, "\"")
				}
				else if (columns[i] === 'Session') {
					content = content.concat("\"", obj.timeSlot, "\"")
				}
				else if (columns[i] === 'Top Interest') {
					content = content.concat("\"", obj.application.interests[0], "\"")
				}
				else if (columns[i] === 'Interviewers') {
					content = content.concat("\"", obj.interviewer[0], ", ", obj.interviewer[1], "\"")
				}
				else if (columns[i] === 'Expertise') {
					content = content.concat("\"", obj.application.areaofexpertise, "\"")
				}
				else if (columns[i] === 'Sessions') {
					content = content.concat("\"", obj.sessions, "\"")
				}
				else if (columns[i] === 'Amount of Interviews') {
					content = content.concat("\"", obj.interviewee_count, "\"")
				}
				else if (columns[i] === 'Interviewees') {
					content = content.concat("\"", obj.interviewee, "\"")
				}
				if (i < (columns.length - 1)) {
					content = content.concat(',');
				}
			}
			return content;
		}

		// download CSV
		function downloadAllCSV(columns) {
			vm.loading = true;
			// get student info
			var header = putColsInString(columns);
			var content = "";
			//$scope.StudentService.studentListActive().then(function(data){
			StudentService.studentList().then(function (data) {
				var Students = data;
				console.log("data ", data)
				Students.forEach(function (student) { // creates and formats student data on a CSV sheet
					var formatedCols = putColsInCSVFormat(columns, student)
					content = formatedCols + "\n" + content;
					console.log("formatted content: ", content)

				});
				content = header + content;
				//var fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
				var link = document.createElement('a');
				link.href = 'data:attachment/csv,' + encodeURIComponent(content);
				link.download = 'All_Students_CSV.csv';
				link.click();
				vm.loading = false;
				$state.reload();

			},
				function (error) {
					vm.loading = false;
					$scope.error = 'Unable to retrieve students!\n' + error;
				});
		}
		function downloadVolunteersCSV(columns) {
			vm.loading = true;
			// get volunteer info
			var header = putColsInString(columns);
			var content = "";
			VolunteerService.getVolunteers().then(function (data) {
				var Volunteers = data;

				Volunteers.forEach(function (volunteer) { // creates and formats volunteer data on a CSV sheet
					var formatedCols = putColsInCSVFormat(columns, volunteer)
					content = formatedCols + "\n" + content;
					console.log("formatted content: ", content)
				});
				content = header + content;

				//var fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
				var link = document.createElement('a');
				link.href = 'data:attachment/csv,' + encodeURIComponent(content);
				link.download = 'All_Volunteers_CSV.csv';
				link.click();
				vm.loading = false;
				$state.reload();

			},
				function (error) {
					vm.loading = false;
					$scope.error = 'Unable to retrieve volunteers!\n' + error;
				});
		}

		// Download ONLY active students
		function downloadActiveCSV(columns) {
			// get student info
			vm.loading = true;
			var header = putColsInString(columns);
			var content = "";
			//$scope.StudentService.studentListActive().then(function(data){
			StudentService.studentListAccepted().then(function (data) {
				var Students = data;

				Students.forEach(function (student) { // creates and formats student data on a CSV sheet
					var formatedCols = putColsInCSVFormat(columns, student)
					content = formatedCols + "\n" + content;
					console.log("formatted content: ", content)
				});
				content = header + content;

				//var fileUrl = $sce.trustAsResourceUrl(URL.createObjectURL(file));
				var link = document.createElement('a');
				link.href = 'data:attachment/csv,' + encodeURIComponent(content);
				link.download = 'Active_Students_CSV.csv';
				link.click();
				vm.loading = false;
				$state.reload();

			},
				function (error) {
					vm.loading = false;
					$scope.error = 'Unable to retrieve students!\n' + error;
				});
		}

		function figureOutItemsToDisplay() {
			vm.filteredItems = $filter('filter')(vm.students, {
				$: vm.search
			});
			vm.filterLength = vm.filteredItems.length;
			var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
			var end = begin + vm.itemsPerPage;
			vm.pagedItems = vm.filteredItems.slice(begin, end);
			vm.loading = false;
		}

		function pageChanged() {
			vm.figureOutItemsToDisplay();
		}

		function listActiveStudents() {
			StudentService.studentListActive().then(async function (data) {
				console.log("active students: ", data);
				vm.students = data;
				vm.selected_user = false;
				await (vm.buildPager());
			});
		};

		function listDeactivatedStudents() {
			StudentService.studentListNonActiveWithoutForms().then(async function (data) {
				console.log("dat1a: ", data);
				vm.students = data;
				vm.selected_user = false;
				await (vm.buildPager());
			});
		}
		function listOldStudents() {
			StudentService.oldStudentList().then(async function (data) {
				console.log("dat1a: ", data);
				vm.students = data;
				vm.selected_user = false;
				await (vm.buildPager());
			});
		}
		//open confirm box when admin performs action

		//open modal window that displays the student resume
		$scope.openModal = function (student, docId) {
			console.log(student);
			vm.modal_student = student;
			$scope.vm.modal_student = vm.modal_student;
			var modal = document.getElementById(docId);
			modal.style.display = "block";
		};

		$scope.closeModal = function (docId) {
			var modal = document.getElementById(docId);
			var span = document.getElementsByClassName("close")[0];

			modal.style.display = "none";
			vm.modal_student = '';
			$scope.vm.modal_student = '';
		};


		/*$scope.view_forms = function(fileId) {

		  alert('Opening file... (Click button to continue)');
		  console.log("fileId: ",fileId);
		googleDriveService.getDoc(fileId + '.pdf').then(function(response){


		     $http.get('./download/' + fileId + '.pdf', { responseType: 'arraybuffer' })
		    .success(function (data) {
		       // alert("hi");
		       console.log(data);
		       // var data ='some data';
		        var file = new Blob([data], {
		            type: 'application/pdf'
		            // type:'image/png'
		        });
		        // var fileURL = URL.createObjectURL(file);
		        // window.open(fileURL);


		        var url = $window.URL || $window.webkitURL;

		        $scope.fileUrl = $sce.trustAsResourceUrl(url.createObjectURL(file));
		        // $scope.fileUrl = window.URL.createObjectURL(file);
		        // console.log($scope.fileUrl)
		        var link = document.createElement('a');
		            link.href = $scope.fileUrl;
		            link.download = fileId;
		            // console.log(link);
		            link.click();
		      });

		  });
		}*/

		//open tab (either active or deactivated students)
		$scope.openPage = function (pageName, elmnt) {
			// Hide all elements with class="tabcontent" by default */
			var i, tabcontent, tablinks;
			tabcontent = document.getElementsByClassName("tabcontent");
			for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
			}

			// Remove the background color of all tablinks/buttons
			tablinks = document.getElementsByClassName("tablink");
			for (i = 0; i < tablinks.length; i++) {
				tablinks[i].style.backgroundColor = "";
			}

			// Show the specific tab content
			document.getElementById(pageName).style.display = "block";

			// Add the specific color to the button used to open the tab content
			//elmnt.style.backgroundColor = color;
		};

		//table sorts throughout admin side
		$scope.a_sortType = 'name';
		$scope.a_sortReverse = 'true';
		$scope.v_sortType = 'name';
		$scope.v_sortReverse = 'true';
		$scope.active = 'active';
		$scope.activeSelect = 2;
		$scope.activeFilter = true;
		$scope.listings = [{
			val: 0,
			name: "All"
		}, {
			val: 1,
			name: "Active"
		}, {
			val: 2,
			name: "Inactive"
		}];
		$scope.activateClass = "disabledButton";
		$scope.deactivateClass = "disabledButton";
		$scope.volunteersChecked = [];
		$scope.anyChecked = false;

		$scope.printResume = function (divID_1, divID_2, divID_3) {
			var printContents_1 = document.getElementById(divID_1).innerHTML;
			var printContents_2 = document.getElementById(divID_2).innerHTML;
			var printContents = document.getElementById(divID_3).innerHTML;
			//console.log("printContents1: " + printContents_1);
			/*
			/ @params
			/ '' => optional URL of the window you are loading
			/ '_blank' => URL is loaded into a new window, or tab. This is default
			/ 
			*/
			var popup = window.open('', '_blank', 'width=900px, height=600px');
			popup.document.open();
			//popup.focus();
			popup.document.write('<html onload="window.focus();"><meta charset="UTF-8">' +
				'<meta name="viewport" content="width=device-width, initial-scale=1">' +
				'<link rel="stylesheet" href="/modules/core/client/css/core.css" media="print">' +
				'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.0/css/bootstrap.min.css">' +
				'<link rel="stylesheet" href="https://www.w3schools.com/w3css/4/w3.css" media="print">' +
				'<link rel="stylesheet" href="https://www.w3schools.com/lib/w3-theme-black.css" media="print">' +
				'<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto" media="print">' +
				'<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" media="print">' +
				'<style>' +
				'body, html {height: 100%; margin: 0; font-family: "Roboto", sans-serif;}' +
				'h3,h4,h5,h6 {font-size: 11; font-family: "Roboto", sans-serif;}' +
				'h1 {text-align: center;font-family: "Roboto", sans-serif;}' +
				'h2 {text-align: center;font-family: "Roboto", sans-serif;}' +
				'table {width: 20%;}' +
				'body {background-color: #e6f2ff;}' +
				'.center {text-align:center;}' +
				'</style>' +
				//'<body onload="popup.print();">' + printContents + '</div></body></html>');
				'<body onload="window.print();">' + '<div style="width:33%; float:left;">' + printContents_1 + '</div>' + '<div style="width:66%; float:left;">' + printContents_2 + '</div></body></html>');
			popup.document.close();
			/*
				window.print() will trigger a print window first. However, it is blank for some reason on Chrome ONLY until you call print again. 
				so we call print on the window again below. Then to make the 2nd print window come to the front, we call 
				reload on the window and close the old window. There's no documentation on why Chrome is doing this, so this is works for now.
			*/
			popup.print();
			popup.location.reload(true);
			popup.close();
			setTimeout(function () {
				//popup.print();
			}, 100);
		};

		/*

		    $scope.getStudent = function(id) {

		      //console.log("we here");
		      //var id = $stateParams.user;

		      //var id = '59f7f305e58b4010fc1307f4';
		      console.log(id); //ISSUE: id is undefined
		      StudentsService.read(id).then(function(response) {
		        $scope.student = response.data;
		        console.log($scope.student);
		        //console.log(response.data);
		        console.log("or are we here?");
		      }, function(error) {
		        $scope.error = 'Unable to retrieve student!\n' + error;
		        console.log("nope");
		      });
		    };

		    $scope.unmatch = function(id) {

		      var v_id;
		      StudentsService.read(id).then(function(response){

		        //Ask admin to confirm unmatch action
		        var r = confirm('This will unmatch '+response.data.application.name+' from his/her mentor, '+response.data.mentor+'. Would you like to proceed?');

		        //If admin consented to action, unmatch student from mentor
		        if( r === true){
		          v_id = response.data.mentorID;
		          AutomateService.manUnmatch(id, response.data.mentorID).then(function(response){

		            VolunteersService.update(response.data, v_id).then(function(response){

		              alert('Student successfully unmatched from volunteer.');
		              $state.reload();
		            });
		          });
		       }
		      });
		    };

		    /*$scope.autoAssignInterviews = function() {

		      //Ask admin to confirm auto assign interviews action
		      var r=confirm('This will automatically assign three different interviewers to each active student. Would you like to proceed?');

		      //If admin consented to action, automatically assign interviewers to each active student
		      if(r === true){
		        AutomateService.autoAssignInterviewsAll().then(function(response){
		          if(response.data === 'Not enough volunteers available to complete task'){
		            alert('Not enough volunteers available to complete task. There must be at least three active interviewers to use this feature.');
		          }
		          else{
		            alert('Auto assignation of interviewers complete.');
		            console.log(response);
		            $state.reload();
		          }
		        });
		      }
		    };*/

		function manAcceptStudent(student, session) {
			if (session === "NA" || session === "") {
				student.timeSlot = [];

				StudentService.updateStudent(student.user, student)
					.then(onRescindSuccess)
					.catch(onRescindError);
			} else {
				student.timeSlot[0] = session;

				StudentService.updateStudent(student.user, student)
					.then(onAcceptanceSuccess)
					.catch(onAcceptanceError);
			}
		};

		function onAcceptanceSuccess(response) {
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> Student has been accepted into selected session.'
			});
		}

		function onAcceptanceError(response) {
			Notification.error({
				message: response.data.message,
				title: '<i class="glyphicon glyphicon-remove"></i> There was an error when accepting student into selected session.',
				delay: 6000
			});
		}

		function onRescindSuccess(response) {
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> Student has been rescinded from the program.'
			});
		}

		function onRescindError(response) {
			Notification.error({
				message: response.data.message,
				title: '<i class="glyphicon glyphicon-remove"></i> There was an error when rescinding acceptance of selected student.',
				delay: 6000
			});
		}

		/*
		    $scope.autoAcceptStudents = function() {

		      var r = confirm('Students with a complete application will be automatically accepted and sorted into the best-fit session. Would you like to proceed?');

		      if(r === true){
		        AutomateService.autoAcceptAllStudents().then(function(res){
		          alert('Auto acceptance of students has completed.');
		          $state.reload();
		        });
		      }
		    };

		  $scope.addInterviewerToStudent = function(id){
		    AutomateService.replaceInterviewer(id).then(function(response){
		      if(response.data === 'No interviewers available!'){
		        alert('No interviewers currently available to assign to that student.');
		      }
		      else{
		        alert('Interviewer successfully added to student.');
		        $window.location.reload();
		      }
		    })
		  }

		  $scope.chooseInterviewerToStudent = function(studentId,mentorId){
		    AutomateService.chooseInterviewer(studentId,mentorId).then(function(response){
		      if(response.data === 'No interviewers available!'){
		        alert('No interviewers currently available to assign to that student.');
		      }
		      else{
		        alert('Interviewer successfully added to student.');
		        $window.location.reload();
		      }
		    })
		  };
		*/

		function deactivateStudent(user, student, index) {
			vm.loading = true;
			vm.selected_user = false;
			student.active = false;
			student.timeSlot = [];
			student.mentor = "";
			student.mentorID = "";
			student.interviewer = [];
			student.interviewerID = [];
			//vm.students.splice(index, 1);
			//vm.pagedItems.splice(index, 1);


			StudentService.updateStudent(user, student)
				.then(onDeactivationSuccess)
				.catch(onDeactivationError);
		};

		function onDeactivationSuccess(response) {
			vm.listActiveStudents();
			// If successful we assign the response to the global user model
			vm.loading = false;
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> Student deactivation successful.'
			});
			// And redirect to the previous or home page
			//$state.go($state.previous.state.name || 'home', $state.previous.params);
		}

		function onDeactivationError(response) {
			vm.loading = false;
			Notification.error({
				message: response.data.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Student deactivation error.',
				delay: 6000
			});
		}

		function activateStudent(user, student, index) {
			vm.loading = true;
			vm.selected_user = false;
			student.active = true;
			vm.students.splice(index, 1);
			vm.pagedItems.splice(index % 15, 1);

			StudentService.updateStudent(user, student)
				.then(onActivationSuccess)
				.catch(onActivationError);
		};

		function onActivationSuccess(response) {
			vm.listDeactivatedStudents();
			// If successful we assign the response to the global user model
			vm.loading = false;
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> Student activation successful.'
			});
		}

		function onActivationError(response) {
			vm.loading = false;
			Notification.error({
				message: response.data.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Student activation error.',
				delay: 6000
			});
		}

		/* 
		
		CODE FROM PREVIOUS FORMS CONTROLLER

		*/

		function fileNameChangedNDA() {
			var file = document.getElementById('nda_upload').files[0];
			vm.selectedNDAToUpload = file.name;
		}

		function fileNameChangedWaiver() {
			var file = document.getElementById('waiver_upload').files[0];
			vm.selectedWaiverToUpload = file.name;
		}



		function checkFileSize(file) {
			if (file) {
				if (file.size >= 4000000) {
					return 0;
				}

				return 1;
			}

			return 0;
		}
		// uploading new nda template
		function uploadNDA() {
			if (!$scope.file.upload) {
				Notification.error({
					message: 'Please submit the correct NDA file type (PDF).',
					title: '<i class="glyphicon glyphicon-remove"></i> View error.',
					delay: 6000
				});
				return;
			} else if (checkFileSize($scope.file.upload) === 0) {
				Notification.error({
					message: 'The file size must be under 4 MB.',
					title: '<i class="glyphicon glyphicon-remove"></i> View error.',
					delay: 6000
				});
				return;
			}

			vm.loading = true;


			GoogleCloudService.uploadForm('NDA.pdf', $scope.file.upload)
				.then(function (response) {
					$scope.uploading = false;
					vm.loading = false;
					Notification.success({
						message: '<i class="glyphicon glyphicon-ok"></i> NDA upload successful.'
					});
				})
				.catch(function (error) {
					$scope.uploading = false;
					vm.loading = false;
					Notification.error({
						message: 'Could not upload form to google cloud.',
						title: '<i class="glyphicon glyphicon-remove"></i> Error',
						delay: 6000
					});
				});

		}
		// uploading new waiver template
		function uploadWaiver() {
			if (!$scope.file.upload) {
				Notification.error({
					message: 'Please submit the correct Waiver file type (PDF).',
					title: '<i class="glyphicon glyphicon-remove"></i> View error.',
					delay: 6000
				});
				return;
			} else if (checkFileSize($scope.file.upload) === 0) {
				Notification.error({
					message: 'The file size must be under 4 MB.',
					title: '<i class="glyphicon glyphicon-remove"></i> View error.',
					delay: 6000
				});
				return;
			}

			vm.loading = true;

			GoogleCloudService.uploadForm('Waiver.pdf', $scope.file.upload)
				.then(function (response) {
					$scope.uploading = false;
					vm.loading = false;
					Notification.success({
						message: '<i class="glyphicon glyphicon-ok"></i> Waiver upload successful.'
					});
				})
				.catch(function (error) {
					$scope.uploading = false;
					vm.loading = false;
					Notification.error({
						message: 'Could not upload form to google cloud.',
						title: '<i class="glyphicon glyphicon-remove"></i> Error',
						delay: 6000
					});
				});
		}

		function approveNDA(student) {
			vm.user.isNDAAdminApproved = true;

			StudentService.updateStudent(student.user, vm.user).then(function (data) {
				onFormApprovalSuccess('NDA', (student.application.firstName + ' ' + student.application.lastName));
				approveForms(student);
			});
		}

		function approveWaiver(student) {
			vm.user.isWaiverAdminApproved = true;

			StudentService.updateStudent(student.user, vm.user).then(function (data) {
				onFormApprovalSuccess('Waiver', (student.application.firstName + ' ' + student.application.lastName));
				approveForms(student);
			});
		}

		function approveLetterOfRecommendation(student) {
			vm.user.isLetterofRecommendationAdminApproved = true;

			StudentService.updateStudent(student.user, vm.user).then(function (data) {
				onFormApprovalSuccess('Letter of Recommendation', (student.application.firstName + ' ' + student.application.lastName));
				approveForms(student);
			});
		}

		function approveResume(student) {
			vm.user.isResumeAdminApproved = true;

			StudentService.updateStudent(student.user, vm.user).then(function (data) {
				onFormApprovalSuccess('Resume', (student.application.firstName + ' ' + student.application.lastName));
				approveForms(student);
			});
		}

		function approveForms(student) {
			if (student.isResumeAdminApproved === true && student.isLetterofRecommendationAdminApproved === true && student.isNDAAdminApproved === true && student.isWaiverAdminApproved === true) {
				student.areFormsAdminApproved = true;


				StudentService.updateStudent(student.user, student).then(function (data) {
					onFormCompletionSuccess(data);
				});
			}
		}

		function onFormApprovalSuccess(formName, studentName) {
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> The ' + formName + ' form belonging to ' + studentName + ' has been approved.'
			});
		}

		function onFormCompletionSuccess(response) {
			// If successful we assign the response to the global user model
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> All of the forms applicable to this student have been approved.'
			});
			// And redirect to the previous or home page
			//$state.go($state.previous.state.name || 'home', $state.previous.params);
		}

		function sendFormFixEmail(student, formName) {
			vm.loading = true;

			var credentials = {
				email: student.application.email,
				firstName: student.application.firstName,
				lastName: student.application.lastName,
				formName: formName
			}

			UsersService.sendFormFixEmail(credentials)
				.then(onFormFixEmailDeliverySuccess)
				.catch(onFormFixEmailDeliveryError);
		}

		function onFormFixEmailDeliverySuccess(response) {
			// If successful we assign the response to the global user model
			vm.loading = false;
			Notification.success({
				message: '<i class="glyphicon glyphicon-ok"></i> Email sent successfully.'
			});
		}

		function onFormFixEmailDeliveryError(response) {
			vm.loading = false;
			Notification.error({
				message: response.data.message,
				title: '<i class="glyphicon glyphicon-remove"></i> Email send error.',
				delay: 6000
			});
		}
	}



}());
