(function() {
	'use strict';

	// Admins controller
	angular
		.module('users')
		.controller('DashboardAdminsController', DashboardAdminsController);

	DashboardAdminsController.$inject = ['$scope', '$state', '$window', '$filter', 'Authentication', 'Notification', 'AdminService', 'UsersService', 'StudentService', 'FileService', 'VolunteerService', /* 'AutomateService', 'googleDriveService',*/ '$http', '$sce'];

	function DashboardAdminsController($scope, $state, $window, $filter, Authentication, Notification, AdminService, UsersService, StudentService, FileService, VolunteerService, /*AutomateService, googleDriveService,*/ $http, $sce) {
		var vm = this;
		vm.newStudentActivity = newStudentActivity;
		vm.completedStudentApps = completedStudentApps;
		vm.completedStudentForms = completedStudentForms;

		vm.newVolunteerActivity = newVolunteerActivity;
		vm.completedVolunteerApps = completedVolunteerApps;

		vm.newStudentActivityGraph = {
			config: {
				title: 'Sign-ups this Week'
			},
			labels: ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "1 days ago", "Today"],
			series: ['Series A'],
			data: [0, 0, 0, 0, 0, 0, 0],
			datasetOverride: [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }],
			options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      },
			onClick: function (points, evt) {
        console.log(points, evt);
      }
		};
    
		vm.newVolunteerActivityGraph = {
			config: {
				title: 'Sign-ups this Week'
			},
			labels: ["6 days ago", "5 days ago", "4 days ago", "3 days ago", "2 days ago", "1 days ago", "Today"],
			series: ['Series A'],
			data: [0, 0, 0, 0, 0, 0, 0],
			datasetOverride: [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }],
			options: {
        scales: {
          yAxes: [
            {
              id: 'y-axis-1',
              type: 'linear',
              display: true,
              position: 'left'
            }
          ]
        }
      },
			onClick: function (points, evt) {
        console.log(points, evt);
      }
		};

		vm.completedStudentAppsGraph = {
			config: {
				title: 'Completed Applications'
			},
			labels: ["Completed", "Not Completed"],
			data: [0, 0],
			onClick: function (points, evt) {
        console.log(points, evt);
      }
		}

		vm.completedStudentFormsGraph = {
			config: {
				title: 'Completed Forms'
			},
			labels: ["Admin-Approved + Completed Forms", "Forms Not Completed", "Student-Approved Forms Only" ],
			data: [0, 0, 0],
			onClick: function (points, evt) {
        console.log(points, evt);
      }
		}

		vm.completedVolunteerAppsGraph = {
			config: {
				title: 'Completed Applications'
			},
			labels: ["Completed", "Not Completed"],
			data: [0, 0],
			onClick: function (points, evt) {
        console.log(points, evt);
      }
		}

		vm.newStudentActivity();
		vm.completedStudentApps();
		vm.completedStudentForms();
		vm.newVolunteerActivity();
		vm.completedVolunteerApps();
    
    vm.appsClosed = false;
    vm.closeStudentApps = closeStudentApps;
    
    function closeStudentApps() {
      StudentService.closeStudentApps().then((res) => {
        console.log("students can no longer log in :" + res);
        vm.appsClosed = true;
      })
    }
		function completedStudentApps() {
			AdminService.completedStudentApps().then(function(response){
				const notCompleted = response.values[0] - response.values[1];
				const Completed = response.values[1];

				vm.completedStudentAppsGraph.data = [Completed, notCompleted];
			});
		}

		function completedVolunteerApps() {
			AdminService.completedVolunteerApps().then(function(response){
				console.log('VOLAPS');
				console.log(response);
				const notCompleted = response.values[0] - response.values[1];
				const Completed = response.values[1];

				vm.completedVolunteerAppsGraph.data = [Completed, notCompleted];
			});
		}

		function completedStudentForms() {
				AdminService.completedStudentForms().then(function(response){
					const notCompleted = response.values[0];
					const onlyStudentApproved = response.values[1];
					const adminApproved = response.values[2];

					vm.completedStudentFormsGraph.data = [adminApproved, notCompleted, onlyStudentApproved ];
				});
		}
    
		function newStudentActivity() {
			const now = new Date();
	    const day1 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-6);
	    const day2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-5);
	    const day3 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-4);
	    const day4 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-3);
	    const day5 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-2);
	    const day6 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
	    const day7 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			console.log('here');
			console.log(day7);

			AdminService.newStudentActivity().then(function(response){
				console.log(response);
				console.log(response.users);
				console.log('num users: ',response.users.length);
				response.users.forEach(function(user, i){
					console.log(user);
	        var userDate = new Date(user.created);
	        if(userDate < day1){
	          vm.newStudentActivityGraph.data[0] = vm.newStudentActivityGraph.data[0] + 1;
	        }
	        else if(userDate < day2){
	          vm.newStudentActivityGraph.data[1] = vm.newStudentActivityGraph.data[1] + 1;
	        }
	        else if(userDate < day3){
	          vm.newStudentActivityGraph.data[2] = vm.newStudentActivityGraph.data[2] + 1;
	        }
	        else if(userDate < day4){
	          vm.newStudentActivityGraph.data[3] = vm.newStudentActivityGraph.data[3] + 1;
	        }
	        else if(userDate < day5){
	          vm.newStudentActivityGraph.data[4] = vm.newStudentActivityGraph.data[4] + 1;
	        }
	        else if(userDate < day6){
	          vm.newStudentActivityGraph.data[5] = vm.newStudentActivityGraph.data[5] + 1;
	        }
	        else if(userDate < day7){
	          vm.newStudentActivityGraph.data[6] = vm.newStudentActivityGraph.data[6] + 1;
	        }
				});
			});
		}

		function newVolunteerActivity() {
			const now = new Date();
	    const day1 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-6);
	    const day2 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-5);
	    const day3 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-4);
	    const day4 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-3);
	    const day5 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-2);
	    const day6 = new Date(now.getFullYear(), now.getMonth(), now.getDate()-1);
	    const day7 = new Date(now.getFullYear(), now.getMonth(), now.getDate());

			AdminService.newVolunteerActivity().then(function(response){
				console.log("VOLACT");
				console.log(response);
				response.users.forEach(function(user, i){
					console.log(user);
	        var userDate = new Date(user.created);
	        if(userDate < day1){
	          vm.newVolunteerActivityGraph.data[0] = vm.newVolunteerActivityGraph.data[0] + 1;
	        }
	        else if(userDate < day2){
	          vm.newVolunteerActivityGraph.data[1] = vm.newVolunteerActivityGraph.data[1] + 1;
	        }
	        else if(userDate < day3){
	          vm.newVolunteerActivityGraph.data[2] = vm.newVolunteerActivityGraph.data[2] + 1;
	        }
	        else if(userDate < day4){
	          vm.newVolunteerActivityGraph.data[3] = vm.newVolunteerActivityGraph.data[3] + 1;
	        }
	        else if(userDate < day5){
	          vm.newVolunteerActivityGraph.data[4] = vm.newVolunteerActivityGraph.data[4] + 1;
	        }
	        else if(userDate < day6){
	          vm.newVolunteerActivityGraph.data[5] = vm.newVolunteerActivityGraph.data[5] + 1;
	        }
	        else if(userDate < day7){
	          vm.newVolunteerActivityGraph.data[6] = vm.newVolunteerActivityGraph.data[6] + 1;
	        }
				});
			});
		}
	}


}());
