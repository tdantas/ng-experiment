angular.module('ExperimentApp').factory('todoStorage', function () {
    'use strict';
    var NAMESPACE = 'experiment-angular:todos';

    return function(customNamespace) {
      customNamespace = customNamespace || NAMESPACE;
      return { get: get, put: put };  


      function get(cb) {
        cb = cb || angular.noop;
        var todos = JSON.parse(localStorage.getItem(customNamespace)) || []
        cb(null, todos); 
      }

      function put(todos, cb) {
        cb = cb || angular.noop;
        localStorage.setItem(customNamespace, JSON.stringify(todos))
        cb(null, todos); 
      }

    } 

});