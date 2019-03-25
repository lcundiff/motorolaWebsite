(function () {
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
            },
            {
              id: 'y-axis-2',
              type: 'linear',
              display: true,
              position: 'right'
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

		vm.newStudentActivity();
		vm.completedStudentApps();

		function completedStudentApps() {
				AdminService.completedStudentApps().then(function(response){
					const notCompleted = response.values[0] - response.values[1];
					const Completed = response.values[1];

					console.log("C", Completed);
					console.log("nC", notCompleted);

					vm.completedStudentAppsGraph.data = [Completed, notCompleted];
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

			AdminService.newStudentActivity().then(function(response){
				console.log(response);
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





	}


}());
