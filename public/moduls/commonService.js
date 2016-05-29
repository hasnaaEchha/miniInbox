angular.module("miniApp").factory('CommonService',function GoogleService($http,$localStorage) {
    var common = {};
    var http;
    common.storeData = function (name,value){
        $localStorage[name]=value;
    };
    common.getData = function (name){
        return $localStorage[name];
    };
    return common;
});

