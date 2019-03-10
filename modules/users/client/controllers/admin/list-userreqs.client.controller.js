(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('ReqListController', ReqListController);

  ReqListController.$inject = ['$scope', '$filter', '$window', 'AdminService', 'UsersService', 'Notification'];

  function ReqListController($scope, $filter, $window, AdminService, UsersService, Notification) {
    var vm = this;
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
    /*AdminService.retrieveUsers(function (data) {
      console.log("data: ",data);
      console.log("YO");
      vm.users = data.users;
      vm.buildPager();
    });*/

    function buildPager() {
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
    }

    function pageChanged() {
      vm.figureOutItemsToDisplay();
    }

    function sendSignupEmail(userReq) {
      console.log("roles: ",userReq.roles);

      AdminService.updateUserReq(userReq._id, userReq).then(function(data){
        console.log("data");
      });
      UsersService.sendSignupLink(userReq).then(function(data){
        console.log("YEAH DONE: ",data);
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> Email sent successfully.' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> Email send error.' });

      }, function(err){
        console.log("err: ",err);
      });
    }

    function remove(userreq) {
      console.log("userreq: ",userreq);

      if ($window.confirm('Are you sure you want to delete this user request?')) {
        if (userreq) {

          AdminService.deleteUserReq(userreq).then(function(response){
            console.log("response");
          }, function(err){
            Notification.error({ message: err.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User request deletion error.' });
          });
          vm.userreqs.splice(vm.userreqs.indexOf(userreq), 1);
          console.log("vm.userreqs: ",vm.userreqs);
          vm.pagedItems.splice(vm.pagedItems.indexOf(userreq), 1);
          Notification.success('User deleted successfully!');
        } else {
          Notification.error({ message: 'Please specify the user request to remove.', title: '<i class="glyphicon glyphicon-remove"></i> User request deletion error.' })
        }
      }
    }
  }
}());
