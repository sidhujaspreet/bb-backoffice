
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
        .controller('cityCtrl', cityCtrl)
        .controller('packageCtrl', packageCtrl);
    
    appCtrl.$inject = ['$rootScope', '$state', '$cookies'];
    homeCtrl.$inject = ['$state'];
    loginCtrl.$inject = ['$rootScope', '$state', 'UserService', '$cookies'];
    registerCtrl.$inject = ['$rootScope', '$state', 'UserService', '$cookies'];
    portalCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData'];
    unauthoCtrl.$inject = ['$state'];

    tableCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData', '$stateParams', 'DataModels'];

    cityCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData', '$stateParams', 'DataModels'];
    packageCtrl.$inject = ['$rootScope', 'TableData', '$state', 'CommonTableData', '$stateParams', 'DataModels'];

    
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

    function tableCtrl($rootScope, TableData, $state, CommonTableData, $stateParams, DataModels){
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

    function cityCtrl($rootScope, TableData, $state, CommonTableData, $stateParams, DataModels){
        var vm = {};
        
        var tableName = $stateParams.tableName;
        vm.data = {};
        vm.newData = {};
        vm.selectedCityList = [];
        vm.currentDataset = {
            city : {},
            hotel : {},
            room : {}
        };
        vm.currentIndex = {
            city : {},
            hotel : {},
            room : {}
        };

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
                vm.currentDataset[tableName] = vm.data[tableName][index];
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
            TableData.postTableContent(tableName, vm.currentDataset.city).then(function(data){
                console.log('Success - saved city!!!');
                console.log(data);
                vm.renderTable(tableName)
                vm.tableFunctions.destroy('city');
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

        //create, destroy, save
        vm.tableFunctions = {
            create : function(name){
                vm.currentDataset[name] = new DataModels[name]();
            },
            destroy : function(name){
                vm.currentDataset[name] = {};
            },
            save : {
                hotel : function(){
                    vm.currentDataset.city.hotelList.push(vm.currentDataset.hotel);
                    vm.tableFunctions.destroy('hotel');
                },
                room : function(){
                    vm.currentDataset.hotel.roomList.push(vm.currentDataset.room);
                    vm.tableFunctions.destroy('room');
                }
            }
        };
        
        //view, edit
        vm.tableEvents = {
            view : {
                city : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.city = index;
                        vm.currentDataset.city = vm.data[tableName][index];
                    }
                },
                hotel : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.hotel = index;
                        vm.currentDataset.hotel = vm.currentDataset.city.hotelList[index];
                    }
                },
                room : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.room = index;
                        vm.currentDataset.room = vm.currentDataset.hotel.roomList[index];
                    }
                }
            },
            edit : {
                city : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.city = index;                        
                        vm.currentDataset.city = vm.data[tableName][index];
                    }
                },
                hotel : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.hotel = index;
                        if(vm.currentDataset.city.hotelList[index] && vm.currentDataset.city.hotelList[index].id == vm.currentDataset.hotel.id) {
                            vm.currentDataset.city.hotelList.splice(index, 1, vm.currentDataset.hotel);
                        } else {
                            vm.currentDataset.hotel = vm.currentDataset.city.hotelList[index];
                        }
                    }
                },
                room : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.room = index;
                        if(vm.currentDataset.hotel.roomList[index] && vm.currentDataset.hotel.roomList[index].id == vm.currentDataset.room.id) {
                            vm.currentDataset.hotel.roomList.splice(index, 1, vm.currentDataset.room);
                        } else {
                            vm.currentDataset.room = vm.currentDataset.hotel.roomList[index];
                        }
                    }
                }
            },
            delete : {
                hotel : function(index){
                    vm.currentDataset.city.hotelList.splice(index, 1);
                    vm.tableFunctions.destroy('hotel');
                },
                room : function (index) {
                    vm.currentDataset.hotel.roomList.splice(index, 1);
                    vm.tableFunctions.destroy('room');
                }
            }
        };

        (function onInit(){
            vm.renderTable(tableName);
        })();

        return vm;
    };

    function packageCtrl($rootScope, TableData, $state, CommonTableData, $stateParams, DataModels){
        var vm = {};
        
        var tableName = $stateParams.tableName;

        vm.multiselectCitySettings = {
            displayProp: 'code',
            buttonDefaultText: 'Select Cities',
            scrollableHeight: '200px',
            scrollable: true,
            styleActive: true,
            enableSearch: true,
            keyboardControls: true,
            smartButtonMaxItems: 10,
            selectedToTop: true,
            externalIdProp: '',
            smartButtonTextConverter: function(itemText, originalItem) { 
                return itemText; 
            }
        };
        vm.multiselectCityEvents = {
            onSelectionChanged: function(){
                vm.currentDataset.package.cityList = vm.selectedCityList;
            }
        };

        vm.test = [
          {
            "id": 1,
            "label": "David"
          },
          {
            "id": 2,
            "label": "Jhon"
          },
          {
            "id": 3,
            "label": "Danny"
          }
        ];
        console.log(vm.test);
        vm.selectedTest = [];

        vm.data = {};
        vm.newData = {};
        vm.selectedCityList = [];
        vm.selectedHotelList = [];
        vm.selectedRoomList = [];
        vm.currentDataset = {
            package : {},
            city : {},
            hotel : {},
            room : {}
        };
        vm.currentIndex = {
            city : {},
            hotel : {},
            room : {}
        };

        vm.renderTable = function(tableName){
            TableData.getFullTableContent(tableName).then(function(data) {
                vm.data[tableName] = data;
                CommonTableData.putData(data);
                $state.go('portal.' + tableName);
                $state.go('portal.' + tableName + '.list');
            });
            TableData.getFullTableContent('cities').then(function(data) {
                //vm.data[cities] = data;
                vm.currentDataset.cityList = data;
                console.log("============");
                console.log(vm.currentDataset.cityList);
                console.log("============");
            });
        };

        vm.viewBtn = function(index){
            if(index != null || index != undefined){
                vm.currentDataset[tableName] = vm.data[tableName][index];
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
            TableData.postTableContent(tableName, vm.currentDataset.city).then(function(data){
                console.log('Success - saved city!!!');
                console.log(data);
                vm.renderTable(tableName)
                vm.tableFunctions.destroy('city');
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

        //create, destroy, save
        vm.tableFunctions = {
            create : function(name){
                vm.currentDataset[name] = new DataModels[name]();
            },
            destroy : function(name){
                vm.currentDataset[name] = {};
            },
            save : {
                hotel : function(){
                    vm.currentDataset.city.hotelList.push(vm.currentDataset.hotel);
                    vm.tableFunctions.destroy('hotel');
                },
                room : function(){
                    vm.currentDataset.hotel.roomList.push(vm.currentDataset.room);
                    vm.tableFunctions.destroy('room');
                }
            }
        };
        
        //view, edit
        vm.tableEvents = {
            view : {
                city : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.city = index;
                        vm.currentDataset.city = vm.data[tableName][index];
                    }
                },
                hotel : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.hotel = index;
                        vm.currentDataset.hotel = vm.currentDataset.city.hotelList[index];
                    }
                },
                room : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.room = index;
                        vm.currentDataset.room = vm.currentDataset.hotel.roomList[index];
                    }
                }
            },
            edit : {
                city : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.city = index;                        
                        vm.currentDataset.city = vm.data[tableName][index];
                    }
                },
                hotel : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.hotel = index;
                        if(vm.currentDataset.city.hotelList[index] && vm.currentDataset.city.hotelList[index].id == vm.currentDataset.hotel.id) {
                            vm.currentDataset.city.hotelList.splice(index, 1, vm.currentDataset.hotel);
                        } else {
                            vm.currentDataset.hotel = vm.currentDataset.city.hotelList[index];
                        }
                    }
                },
                room : function(index){
                    if(index != null || index != undefined){
                        vm.currentIndex.room = index;
                        if(vm.currentDataset.hotel.roomList[index] && vm.currentDataset.hotel.roomList[index].id == vm.currentDataset.room.id) {
                            vm.currentDataset.hotel.roomList.splice(index, 1, vm.currentDataset.room);
                        } else {
                            vm.currentDataset.room = vm.currentDataset.hotel.roomList[index];
                        }
                    }
                }
            },
            delete : {
                hotel : function(index){
                    vm.currentDataset.city.hotelList.splice(index, 1);
                    vm.tableFunctions.destroy('hotel');
                },
                room : function (index) {
                    vm.currentDataset.hotel.roomList.splice(index, 1);
                    vm.tableFunctions.destroy('room');
                }
            }
        };

        (function onInit(){
            vm.renderTable(tableName);
        })();

        return vm;
    };

})();

//https://api.myjson.com/bins/jpu6v
