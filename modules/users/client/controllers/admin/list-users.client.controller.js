(function () {
  'use strict';

  angular
    .module('users.admin')
    .controller('UserListController', UserListController);

  UserListController.$inject = ['$scope', '$filter', '$window', 'AdminService', 'Notification'];

  function UserListController($scope, $filter, $window, AdminService, Notification) {
    var vm = this;
    vm.buildPager = buildPager;
    vm.figureOutItemsToDisplay = figureOutItemsToDisplay;
    vm.pageChanged = pageChanged;

    vm.displayUser = displayUser;
    vm.selected_user = false;

    vm.editUser = editUser;
    vm.edit_user = false;

    vm.remove = remove;
    vm.update = update;
    vm.cancel = cancel;

    AdminService.retrieveUsers().then(async function (data) {

      vm.users = data.users;
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
      vm.filteredItems = $filter('filter')(vm.users, {
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

    function displayUser(user){
      vm.user = user;
      vm.user.edit_user = false;

      console.log(vm.user);

      vm.selected_user = true;
      vm.user
    }

    function editUser(){
      vm.user.edit_user = true;
    }

    function remove(user) {
      if ($window.confirm('Are you sure you want to delete this user?')) {
        if (user) {
          console.log("user: ",user);
          console.log("user._id: ",user._id);

          AdminService.deleteUser(user._id, user).then(function(response){
            console.log("delete response: ",response);
          })
          vm.users.splice(vm.users.indexOf(user), 1);
          vm.pagedItems.splice(vm.pagedItems.indexOf(user), 1);
          vm.selected_user = false;
          Notification.success('User deleted successfully!');
        } else {
          Notification.error({ message: 'Please specify the user to remove.', title: '<i class="glyphicon glyphicon-remove"></i> User deletion error.' })
        }
      }
    }

    function update() {

      var user = vm.user;
      delete user.edit_user;

      console.log("user: ",user);

      console.log("update vm user: ",vm.user);
      console.log(vm.user._id);


      AdminService.updateUser(user._id, user).then(function(data){
        console.log(data);
        vm.user = user;
        vm.user.edit_user = false;

        /*$state.go('admin.user', {
          userId: user._id
        });*/
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });

      });
    /*  user.$update(function () {
        $state.go('admin.user', {
          userId: user._id
        });
        Notification.success({ message: '<i class="glyphicon glyphicon-ok"></i> User saved successfully!' });
      }, function (errorResponse) {
        Notification.error({ message: errorResponse.data.message, title: '<i class="glyphicon glyphicon-remove"></i> User update error!' });
      });*/
    }

    function cancel(user){


      AdminService.retrieveUser(user._id).then(function(response){
        vm.user.edit_user = false;
        vm.user.username = response.username;
        vm.user.firstName = response.firstName;
        vm.user.lastName = response.lastName;
        vm.user.email = response.email;
        vm.user.roles= response.roles;
      });
    }
  }
}());
