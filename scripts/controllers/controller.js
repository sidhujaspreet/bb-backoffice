
(function(){
    'use strict';

    angular
        .module('gofarModule.gofarControllers', ['gofarModule.gofarFactories'])
        .controller('appCtrl', appCtrl)
        .controller('homeCtrl', homeCtrl)
        .controller('loginCtrl', loginCtrl)
        .controller('registerCtrl', registerCtrl)
        .controller('portalCtrl', portalCtrl)
        .controller('unauthoCtrl', unauthoCtrl)
        .controller('tableCtrl', tableCtrl)
        .controller('packageCtrl', packageCtrl);
    
    appCtrl.$inject = ['$rootScope', '$state', '$cookies'];
    homeCtrl.$inject = ['$state'];
    loginCtrl.$inject = ['$rootScope', '$state', 'UserService', '$cookies'];
    registerCtrl.$inject = ['$rootScope', '$state', 'UserService', '$cookies'];
    portalCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData'];
    unauthoCtrl.$inject = ['$state'];

    tableCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData', '$stateParams'];
    packageCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData', '$stateParams'];

    
    function appCtrl($rootScope, $state, $cookies){
        var appC = this;
        appC.rolePublic = ['public'];
        appC.roleUser = ['user'];
        appC.roleAdmin = ['admin'];
        appC.roleALL = ['public', 'user', 'admin'];
        appC.roleUserAdmin = ['user', 'admin'];
        appC.rolePublicUser = ['public', 'user'];
        appC.logoutClick = logoutClick;
        return appC;
        
        function logoutClick() {
            //$rootScope.isLoggedin = false;
            $rootScope.token = "";
            $cookies['loggedIn'] = 'false';
            $state.go('home.login');
        }
    };
    
    function homeCtrl($state){
        var self = this;
        
        self.goToLogin = (function(){
            $state.go('home.login');
        })();
        
        self.goToRegister = function(){ 
            $state.go('home.register');
        };
        
        return self;
    };
    
    function loginCtrl($rootScope, $state, UserService, $cookies){
        var vm = this;
        
        vm.user = {
            username : '',
            password : ''
        };
        
        vm.login = function(){
            var creds = vm.user.username + ':' + vm.user.password;
            UserService.login(creds).then(function(data) {
                if(data.success == true) {
                    $cookies['loggedIn'] = 'true';
                    $state.go('portal');
                }
            });
        };
        
        return vm;
    };
    
    function registerCtrl($rootScope, $state, UserService, $cookies){
        var vm = this;
        vm.user = {
            name : '',
            password : '',
            email : '',
            cPassword : ''
        };
        vm.register = function(){

            var newUser = {
                username : vm.user.name,
                password : vm.user.password,
                email : vm.user.email
            };
            UserService.register(newUser).then(function(data) {
                if(data.success == true) {
                    $cookies['loggedIn'] = 'true';
                    $state.go('portal');
                }
            });
        };

        return vm;
    };

    function portalCtrl($rootScope, TableData, $state, CommonTableData){
        var vm = this;    
        
        vm.tableList = [];
        vm.data = "";

        vm.renderTableList = function(){
            TableData.getTableList().then(function(data) {
                vm.tableList = data;
            });
        };  

        vm.renderTable = function(tableName){
            TableData.getFullTableContent(tableName).then(function(data) {
                vm.data = data;
                CommonTableData.putData(data);
                $state.go('portal.' + tableName);
                $state.go('portal.' + tableName + '.list');
            });
        };
        
        (function onInit(){
            vm.renderTableList();
        })();
        return vm;
    };
    
    function unauthoCtrl($state){
        var self = this;
        self.goToHome = function(){
            $state.go('home');
        };
        return self;
    };

    function tableCtrl($rootScope, TableData, $state, CommonTableData, $stateParams){
        var vm = {};
        
        var tableName = $stateParams.tableName;
        vm.data = {};
        vm.newData = {};
        vm.selectedCityList = [];

        vm.renderTable = function(tableName){
            TableData.getFullTableContent(tableName).then(function(data) {
                vm.data[tableName] = data;
                CommonTableData.putData(data);
                $state.go('portal.' + tableName);
                $state.go('portal.' + tableName + '.list');
            });
        };

        vm.viewBtn = function(index){
            if(index != null || index != undefined){
                vm.newData[tableName] = vm.data[tableName][index];
            }
        };

        vm.addBtn = function(){
            vm.newData[tableName] = {};
        };

        vm.editBtn = function(index){
            if(index != null || index != undefined){
                vm.newData[tableName] = vm.data[tableName][index];
            }
        };
        
        vm.deleteBtn = function(index){
            if(index != null || index != undefined){
                vm.newData[tableName] = vm.data[tableName][index];
            }
        };
        
        vm.submitEdit = function(){
            TableData.putTableContent(tableName, vm.newData[tableName]).then(function(data){
                vm.renderTable(tableName)
            });
        };
        
        vm.submitAdd = function(){
            TableData.postTableContent(tableName, vm.newData[tableName]).then(function(data){
                vm.renderTable(tableName)
            });
        };

        vm.submitDelete = function(index){
            if(index != null || index != undefined){
                vm.newData[tableName] = vm.data[tableName][index];
            }
            TableData.deleteTableContent(tableName, vm.newData[tableName]._id).then(function(data){
                vm.renderTable(tableName)
            });
        };
        
        (function onInit(){
            vm.renderTable(tableName);
        })();

        return vm;
    };

    function packageCtrl($rootScope, TableData, $state, CommonTableData, $stateParams){
        var vm = {};

        var tableName = $stateParams.tableName;
        vm.data = {};
        vm.newData = {};
        vm.isEditing = false;

        vm.renderTable = function(tableName){
            TableData.getFullTableContent(tableName).then(function(data) {
                vm.data[tableName] = data;
                CommonTableData.putData(data);
                $state.go('portal.' + tableName);
                $state.go('portal.' + tableName + '.list');
            });
        };
        vm.viewBtn = function(index){
            if(index != null || index != undefined){
                vm.newData[tableName] = vm.data[tableName][index];
            }
        };

        vm.dblClkEdit = function(e){
            vm.isEditing = true;
        };

        vm.doneEditing = function(){
            vm.isEditing = false;
        };

        (function onInit(){
            vm.renderTable(tableName);
        })();

        return vm;
    };

})();

//https://api.myjson.com/bins/jpu6v
