angular.module("miniApp").factory('GoogleService',function GoogleService($http) {
    var google = {};
    var http;
    google.getCode = function () {
        http = $http.get('google/getCode');
        return http;
    };
    google.getToken = function (code) {
        http = $http.get('google/getToken/?code='+code);

        return http;
    };
    google.getContacts = function (token) {
        http = $http.get("https://www.google.com/m8/feeds/contacts/default/full?access_token=" + token.access_token + "&alt=json");

        return http;
    };
    google.sendMail = function (message) {
        http = $http.post("google/send",{message:message});

        return http;
    };
    
    return google;
});

