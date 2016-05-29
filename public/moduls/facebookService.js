angular.module("miniApp").factory('FacebookService',function FacebookService($http) {
    var facebook = {};
    var http;
    facebook.getCode = function () {
        http = $http.get('facebook/getCode');
        return http;
    };
    facebook.getToken = function (code) {
        http = $http.get('facebook/getToken/?code='+code);
        return http;
    };
    facebook.getContacts = function (token) {
        http = $http.post('facebook/getContacts',{token:token});
        return http;
    };
    facebook.send = function (msg,recId, accessToken) {
        http = $http.post('facebook/send',{recId:recId,msg:msg,accessToken:accessToken});
        return http;
    };
    
    return facebook;
});

