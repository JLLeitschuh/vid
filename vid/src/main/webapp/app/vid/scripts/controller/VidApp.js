/*-
 * ============LICENSE_START=======================================================
 * VID
 * ================================================================================
 * Copyright (C) 2017 AT&T Intellectual Property. All rights reserved.
 * ================================================================================
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *      http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============LICENSE_END=========================================================
 */

(function () {
  'use strict';
  
  app.config(['$routeProvider', '$locationProvider', function ($routeProvider) {
      $routeProvider
        .when('/models/services', {
          controller: 'ServiceModelController',
          templateUrl: 'app/vid/scripts/view-models/serviceModels.htm'
        })
        .when('/instances/services', {
    		templateUrl : "app/vid/scripts/view-models/aaiGetSubs.htm", 
    		controller : "aaiSubscriberController"
        })
        .when('/instances/subdetails', {
    		templateUrl : "app/vid/scripts/view-models/aaiSubDetails.htm", 
    		controller : "aaiSubscriberController"
        })
        .when('/instantiate', {
          controller: 'InstantiationController',
          templateUrl: 'app/vid/scripts/view-models/instantiate.htm'
        })
        .otherwise({
        	redirectTo: '/models/services'
        });
    }]);
  
  app.service('vidService', function() {
	  var _model = undefined;
	  var _instance = undefined;
	  
	  this.setModel = function(model) {
		  _model = model;
	  };
	  
	  this.getModel = function() {
		  return _model;
	  };
	  
	  this.setInstance = function(instance) {
		  _instance = instance;
	  };
	  
	  this.getInstance = function() {
		  return _instance;
	  };
  });
})();
