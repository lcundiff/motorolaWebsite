(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ReqListController', ReqListController);

  ReqListController.$inject = ['$scope', '$filter', '$window', 'AdminService', 'UsersService', 'Notification'];

  function ReqListController($scope, $filter, $window, AdminService, UsersService, Notification) {
    var vm = this;
    vm.loading = false;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;
    vm.sendSignupEmail = sendSignupEmail;
    vm.remove = remove;

    AdminService.retrieveUserReqs().then(async function (data) {
      console.log("data: ",data);

      vm.userreqs = data.userreqs;
      await(vm.buildPager());

    });

    function buildPager() {
      vm.loading = true;
      vm.pagedItems = [];
      vm.itemsPerPage = 15;
      vm.currentPage = 1;
      vm.figureOutItemsToDisplay();
    }


    function figureOutItemsToDisplay() {
      vm.filteredItems = $filter('filter')(vm.userreqs, {
        $: vm.search
      });
      vm.filterLength = vm.filteredItems.length;
      var begin = ((vm.currentPage - 1) * vm.itemsPerPage);
      var end = begin + vm.itemsPerPage;
      vm.pagedItems = vm.filteredItems.slice(begin, end);
      vm.loading = false;
    }

    function pageChanged() {
      vm.loading = true;
      vm.figureOutItemsToDisplay();
    }

    function sendSignupEmail(userReq) {
      vm.loading = true;
      console.log("roles: ",userReq.roles);

      AdminService.updateUserReq(userReq._id, userReq);
      UsersService.sendSignupLink(userReq).then(function(data){
        vm.loading = false;
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Email sent successfully.' });
      }, function (errorResponse) {
        vm.loading = false;
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Email send error.' });

      }, function(err){
        vm.loading = false;
        console.log("err: ",err);
      });
    }

    function remove(userreq) {
      console.log("userreq: ",userreq);

      if ($window.confirm('Are you sure you want to delete this user request?')) {
        if (userreq) {
          vm.loading = true;

          AdminService.deleteUserReq(userreq).then(function(response){
            console.log("response");
          }, function(err){
            vm.loading = false;
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User request deletion error.' });
          });
          vm.userreqs.splice(vm.userreqs.indexOf(userreq), 1);
          console.log("vm.userreqs: ",vm.userreqs);
          vm.pagedItems.splice(vm.pagedItems.indexOf(userreq), 1);
          vm.loading = false;
          Notification.success('User deleted successfully!');
        } else {
          vm.loading = false;
          Notification.error({ message: 'Please specify the user request to remove.', title: '<i class="glyphicon glyphicon-remove"></i> User request deletion error.' })
        }
      }
    }
  }
}());
