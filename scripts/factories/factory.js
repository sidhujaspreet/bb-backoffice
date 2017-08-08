
(function() {
    'use strict';

    angular
        .module('gofarModule.gofarFactories', [])
        .factory('TableData', TableData)
        .factory('UserService', UserService)
        .factory('Permission', Permission)
        .factory('AuthInterceptor', AuthInterceptor)
        .factory('CommonTableData', CommonTableData)

        .factory('DataModels', DataModels);

    TableData.$inject = ['$http'];
    UserService.$inject = ['$http', '$rootScope', '$base64'];
    Permission.$inject = ['$rootScope'];
    AuthInterceptor.$inject = ['$q', '$location', '$rootScope'];
    CommonTableData.$inject = [];

    function TableData($http) {
        var commonUrl = "http://localhost:3000/";
        return {
            getTableList: function() {
                return $http.get(commonUrl + "tableNames")
                .then(function(result){
                    return result.data;
                });
            },
            getFullTableContent: function(tableName) {
                //return the promise directly.
                var url = commonUrl + tableName;
                return $http.get(url)
                    .then(function(result) {
                        //resolve the promise as the data
                        console.log(result.data);
                        return result.data;
                    });
            },
            getTableContent: function(tableName, contentId) {
                //return the promise directly.
                var url = commonUrl + tableName + '/' + contentId;
                return $http.get(url)
                    .then(function(result) {
                        //resolve the promise as the data
                        console.log(result.data);
                        return result.data;
                    });
            },
            postTableContent: function(tableName, content) {
                //return the promise directly.
                var url = commonUrl + tableName;
                return $http.post(url, content)
                    .then(function(result) {
                        //resolve the promise as the data
                        console.log(result.data);
                        return result.data;
                    });
            },
            putTableContent: function(tableName, content) {
                //return the promise directly.
                var id = content._id;
                delete content._id;
                var url = commonUrl + tableName + '/' + id;
                return $http.put(url, content)
                    .then(function(result) {
                        //resolve the promise as the data
                        console.log(result.data);
                        return result.data;
                    });
            },
            deleteTableContent: function(tableName, contentId) {
                //return the promise directly.
                var url = commonUrl + tableName + '/' + contentId;
                return $http.delete(url)
                    .then(function(result) {
                        //resolve the promise as the data
                        console.log(result.data);
                        return result.data;
                    });
            },
        }
    };

    function UserService($http, $rootScope, $base64) {

        var commonUrl = 'http://localhost:3000/';
        var service = {};

        service.login = Login;
        service.register = Register;

        return service;

        function Login(creds) {
            var auth = $base64.encode(creds), 
                headers = {"Authorization": "Basic " + auth};
            return $http.get(commonUrl + 'login', {headers: headers})
                        .then(function(res) {
                            if(res.status == 200) {
                                $rootScope.token = res.data.token;
                                return res.data;
                            } else {
                                console.log(res.data.message);
                            }
                        });
        }

        function Register(user) {
             return $http.post(commonUrl + 'register', user)
                        .then(function(res) {
                            if(res.status == 200) {
                                $rootScope.token = res.data.token;
                                return res.data;
                            } else {
                                console.log(res.data.message);
                            }
                        });
        }

        // private functions

        function handleSuccess(res) {
            //return res.data;
            $rootScope.token = res.token;
            return res.data;
        }

        function handleError(error) {
            return function() {
                return {
                    success: false,
                    message: error
                };
            };
        }
    };

    function Permission($rootScope) {
        return {
            setPermission: function() {
                $rootScope.$broadcast('permissionsChanged');
            },
            permissionList: function() {
                return ['public', 'user', 'admin']
            },
            permissionP: function() {
                return 'public';
            },
            permissionU: function() {
                return 'user';
            },
            permissionA: function() {
                return 'admin';
            }
        };
    };

    function AuthInterceptor($q, $location, $rootScope) {
        return {
            request: function(config) {
                  config.headers['Token'] = $rootScope.token;
                  return config;
            },
            responseError: function(response) {
                if (response.status === 401 || response.status === 403) {
                    $location.path('/unauthorized');
                }
                return $q.reject(response);
            }
        };
    };

    function CommonTableData(){
        var tableData = "";
        return {
            getData : function(){
                return tableData;
            },
            putData : function(data){
                tableData = data;
            }
        };
    };

    function DataModels(){
        var self = {};

        self.room = Room;
        self.hotel = Hotel;
        self.activity = Activity;
        self.city = City;
        self.transport = Transport;
        self.package = Package;

        return self;

        function Room(){
            this.id = '';
            this.type = '';
            this.basicInfo = {
                name : '',
                description: '',
                thumbnail: ''
            };
            this.mealPlan = [];
            this.photoList = [];
            this.amenities = [];
        };

        function Hotel(){
            this.id = '';
            this.selection = {
                isEnabled : true,
                isSelected : false
            };
            this.basicInfo = {
                name : '',
                description: '',
                thumbnail: ''
            };
            this.price = {
                totalActual : '',
                totalDiscounted : '',
                adultActual : '',
                adultDiscounted : '',
                childActual : '',
                childDiscounted : ''
            };
            this.roomList = [];
            this.address = {
                address1 : '',
                address2 : '',
                city : '',
                state : '',
                country : '',
                zipCode : '',
                landmark : ''
            };
            this.userRating = '';
            this.starRating = '';
        };

        function Activity(){
            this.id = '';
            this.selection = {
                isEnabled : true,
                isSelected : false,
                isAddOn : false
            };
            this.category = [];
            this.basicInfo = {
                name : '',
                description: '',
                thumbnail: ''
            };
            this.price = {
                totalActual : '',
                totalDiscounted : '',
                adultActual : '',
                adultDiscounted : '',
                childActual : '',
                childDiscounted : ''
            };
            this.address = {
                address1 : '',
                address2 : '',
                city : '',
                state : '',
                country : '',
                zipCode : '',
                landmark : ''
            };
            this.userRating = '';
        };

        function City(){
            this.id = '';
            this.basicInfo = {
                name : '',
                description: '',
                thumbnail: ''
            };
            this.code = '';
            this.address = {
                address1 : '',
                address2 : '',
                city : '',
                state : '',
                country : '',
                zipCode : '',
                landmark : ''
            };
            this.hotelList = [];
            this.activityList = [];
        };

        function Transport(){
            this.id = '';
            this.type = '';
            this.basicInfo = {
                name : '',
                description: '',
                thumbnail: ''
            };
            this.price = {
                totalActual : '',
                totalDiscounted : '',
                adultActual : '',
                adultDiscounted : '',
                childActual : '',
                childDiscounted : ''
            };
            this.pickup = '';
            this.dropoff = '';
        };

        function Package(){
            this.id = '';
            this.basicInfo = {
                name : '',
                description: '',
                thumbnail: ''
            };
            this.duration = {
                days : '',
                nights : '',
                type : ''
            };
            this.validity = {
                from : '',
                to : ''
            };
            this.photoList = [];
            this.price = {
                totalActual : '',
                totalDiscounted : '',
                adultActual : '',
                adultDiscounted : '',
                childActual : '',
                childDiscounted : ''
            };
            this.cityList = [];
            this.transportList = [];
        };
    };

})();

