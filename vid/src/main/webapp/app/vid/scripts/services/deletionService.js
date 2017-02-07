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

"use strict";

var DeletionService = function($log, AaiService, AsdcService, DataService,
	ComponentService, COMPONENT, FIELD, UtilityService) {

    var _this = this;

    var getAsyncOperationList = function() {
		switch (_this.componentId) {
		case COMPONENT.SERVICE:
			return [ getSubscribers ];
		case COMPONENT.NETWORK:
			return [];
		case COMPONENT.VNF:
			return [ getLcpCloudRegionTenantList ];
		case COMPONENT.VF_MODULE:
			return [ getLcpCloudRegionTenantList ];
		case COMPONENT.VOLUME_GROUP:
			return [ getLcpCloudRegionTenantList ];
		}
	};
	
	var getLcpCloudRegionTenantList = function() {
		AaiService.getLcpCloudRegionTenantList(DataService
				.getGlobalCustomerId(), DataService.getServiceType(), function(
				response) {
			DataService.setCloudRegionTenantList(response);
			UtilityService.startNextAsyncOperation();
		});
	};
	
	var getSubscribers = function() {
		AaiService.getSubscribers(function(response) {
			DataService.setSubscribers(response);
			UtilityService.startNextAsyncOperation();
		});
	};
	
	var internalGetParametersHandler = function() {
		if (angular.isFunction(_this.getParametersHandler)) {
			if (_this.componentId == COMPONENT.SERVICE)
			_this.getParametersHandler({
				summaryList : getSummaryList(),
				userProvidedList : getUserProvidedList()
			}, true);
			else
				_this.getParametersHandler({
					summaryList : getSummaryList(),
					userProvidedList : getUserProvidedList()
				}, false);
		}
	};
	
	var getSubscribersParameter = function() {
		var subscribers = DataService.getSubscribers();
		var parameter = FIELD.PARAMETER.SUBSCRIBER_NAME;
		parameter.optionList = [];

		for (var i = 0; i < subscribers.length; i++) {
			parameter.optionList.push({
				id : subscribers[i]["global-customer-id"],
				name : subscribers[i]["subscriber-name"]
			})
		}
		return parameter;
	};
	
	var getServiceId = function() {
		var serviceIdList = DataService.getServiceIdList();
		var parameter = FIELD.PARAMETER.PRODUCT_FAMILY;
		parameter.optionList = new Array();
		for (var i = 0; i < serviceIdList.length; i++) {
			parameter.optionList.push({
				id : serviceIdList[i].id,
				name : serviceIdList[i].description
			});
		}
		return parameter;
	};
	
	var getUserProvidedList = function() {

		//var parameterList = [ FIELD.PARAMETER.INSTANCE_NAME ];

		var parameterList = [];
		
		switch (_this.componentId) {
		case COMPONENT.SERVICE:
//			parameterList = parameterList.concat([ getSubscribersParameter(),
//					FIELD.PARAMETER.SERVICE_TYPE_DISABLED ]);
			parameterList = [];
			break;
		case COMPONENT.NETWORK:
		case COMPONENT.VNF:
			parameterList = parameterList.concat([ //getServiceId(),
					getLcpRegion(), FIELD.PARAMETER.LCP_REGION_TEXT_HIDDEN,
					FIELD.PARAMETER.TENANT_DISABLED ]);
			break;
		case COMPONENT.VF_MODULE:
			parameterList = parameterList.concat([
			        getLcpRegion(),
					FIELD.PARAMETER.LCP_REGION_TEXT_HIDDEN,
					FIELD.PARAMETER.TENANT_DISABLED
			]);
			
			break;
		case COMPONENT.VOLUME_GROUP:
			parameterList = parameterList.concat([ getLcpRegion(),
					FIELD.PARAMETER.LCP_REGION_TEXT_HIDDEN,
					FIELD.PARAMETER.TENANT_DISABLED ]);
		}

		parameterList.push(FIELD.PARAMETER.SUPPRESS_ROLLBACK);

		//addArbitraryParameters(parameterList);

		return parameterList;
	};
    var getSummaryList = function() {
	switch (_this.componentId) {
	case COMPONENT.NETWORK:
	case COMPONENT.SERVICE:
	case COMPONENT.VNF:
	case COMPONENT.VF_MODULE:
	case COMPONENT.VOLUME_GROUP:
	    var summaryList = [ {
		name : FIELD.NAME.SUBSCRIBER_NAME,
		value : DataService.getSubscriberName()
	    }, {
		name : FIELD.NAME.CUSTOMER_ID,
		value : DataService.getGlobalCustomerId()
	    }, {
		name : FIELD.NAME.SERVICE_UUID,
		value : DataService.getServiceUuid()
	    }, {
		name : FIELD.NAME.SERVICE_NAME,
		value : DataService.getServiceName()
	   /* }, {
		name : FIELD.NAME.USER_SERVICE_INSTANCE_NAME,
		value : DataService.getUserServiceInstanceName()*/
	    } ];

		_this.parameterList = new Array();
		
		addToList(FIELD.NAME.SERVICE_NAME, DataService.getServiceName());

		switch (_this.componentId) {
		case COMPONENT.SERVICE:
			addToList(FIELD.NAME.SERVICE_INVARIANT_UUID, DataService
					.getModelInfo(_this.componentId)["modelInvariantId"]);
			addToList(FIELD.NAME.SERVICE_VERSION, DataService
					.getModelInfo(_this.componentId)["modelVersion"]);
			addToList(FIELD.NAME.SERVICE_UUID, DataService
					.getModelInfo(_this.componentId)["modelNameVersionId"]);
			addToList(FIELD.NAME.SERVICE_DESCRIPTION, DataService
					.getModelInfo(_this.componentId)["description"]);
			addToList(FIELD.NAME.SERVICE_CATEGORY, DataService
					.getModelInfo(_this.componentId)["category"]);
			break;
		case COMPONENT.VF_MODULE:
			addToList(FIELD.NAME.SUBSCRIBER_NAME, DataService
					.getSubscriberName());
			addToList(FIELD.NAME.SERVICE_INSTANCE_NAME, DataService
					.getServiceInstanceName());
			addToList(FIELD.NAME.MODEL_NAME, DataService
					.getModelInfo(_this.componentId)["modelName"]);
			addToList(FIELD.NAME.MODEL_INVARIANT_UUID, DataService
					.getModelInfo(_this.componentId)["modelInvariantId"]);
			addToList(FIELD.NAME.MODEL_VERSION, DataService
					.getModelInfo(_this.componentId)["modelVersion"]);
			addToList(FIELD.NAME.MODEL_UUID, DataService
					.getModelInfo(_this.componentId)["modelNameVersionId"]);
			break;
		case COMPONENT.NETWORK:
		case COMPONENT.VNF:
		case COMPONENT.VOLUME_GROUP:
			addToList(FIELD.NAME.SUBSCRIBER_NAME, DataService
					.getSubscriberName());
			addToList(FIELD.NAME.SERVICE_INSTANCE_NAME, DataService
					.getServiceInstanceName());
			addToList(FIELD.NAME.MODEL_NAME, DataService
					.getModelInfo(_this.componentId)["modelName"]);
			addToList(FIELD.NAME.MODEL_INVARIANT_UUID, DataService
					.getModelInfo(_this.componentId)["modelInvariantId"]);
			addToList(FIELD.NAME.MODEL_VERSION, DataService
					.getModelInfo(_this.componentId)["modelVersion"]);
			addToList(FIELD.NAME.MODEL_UUID, DataService
					.getModelInfo(_this.componentId)["modelNameVersionId"]);
			break;
		}
		
	    var additionalList = ComponentService.getInventoryParameterList(
		    _this.componentId, DataService.getInventoryItem());

	    return summaryList.concat(ComponentService
		    .getDisplayNames(additionalList));
	}
    };

    var getMsoUrl = function() {
	switch (_this.componentId) {
	case COMPONENT.NETWORK:
	    return "mso_delete_nw_instance/"
		    + DataService.getServiceInstanceId() + "/networks/"
		    + DataService.getNetworkInstanceId();
	case COMPONENT.SERVICE:
	    return "mso_delete_svc_instance/"
		    + DataService.getServiceInstanceId();
	case COMPONENT.VNF:
	    return "mso_delete_vnf_instance/"
		    + DataService.getServiceInstanceId() + "/vnfs/"
		    + DataService.getVnfInstanceId();
	case COMPONENT.VF_MODULE:
	    return "mso_delete_vfmodule_instance/"
		    + DataService.getServiceInstanceId() + "/vnfs/"
		    + DataService.getVnfInstanceId() + "/vfModules/"
		    + DataService.getVfModuleInstanceId();
	case COMPONENT.VOLUME_GROUP:
	    return "mso_delete_volumegroup_instance/"
		    + DataService.getServiceInstanceId() + "/vnfs/"
		    + DataService.getVnfInstanceId() + "/volumeGroups/"
		    + DataService.getVolumeGroupInstanceId();
	}
    }

	var addToList = function(name, value) {
		_this.parameterList.push({
			name : name,
			value : value
		});
	};
	
    var getMsoRequestDetails = function(parameterList) {
    	console.log("getMsoRequestDetails invoked");
		var inventoryInfo = ComponentService.getInventoryInfo(
			_this.componentId, DataService.getInventoryItem());
		var modelInfo = DataService.getModelInfo(_this.componentId);
		var requestDetails = {
				modelInfo : {
					modelType : _this.componentId,
					modelInvariantId : modelInfo.modelInvariantId,
					modelNameVersionId : modelInfo.modelNameVersionId,
					modelName : modelInfo.modelName,
					modelCustomizationName : modelInfo.modelCustomizationName,
					modelVersion : modelInfo.modelVersion
				},
				requestInfo : {
					source : "VID"
				}
		};
		
		switch (_this.componentId) {
			case COMPONENT.SERVICE:
			    break;
			case COMPONENT.VNF:
			    console.log("getMsoRequestDetails COMPONENT.VNF");
				var lcpRegion = getValueFromList(FIELD.ID.LCP_REGION, parameterList);
				if (lcpRegion === FIELD.KEY.LCP_REGION_TEXT) {
					lcpRegion = getValueFromList(FIELD.ID.LCP_REGION_TEXT,
							parameterList);
				}
				requestDetails.cloudConfiguration = {
					lcpCloudRegionId : lcpRegion,
					tenantId : getValueFromList(FIELD.ID.TENANT, parameterList)
				};
	
				break;
			case COMPONENT.VF_MODULE:
					var lcpRegion = getValueFromList(FIELD.ID.LCP_REGION, parameterList);
					if (lcpRegion === FIELD.KEY.LCP_REGION_TEXT) {
						lcpRegion = getValueFromList(FIELD.ID.LCP_REGION_TEXT,
								parameterList);
					}
					requestDetails.cloudConfiguration = {
							lcpCloudRegionId : lcpRegion,
							tenantId : getValueFromList(FIELD.ID.TENANT, parameterList)
					};	
					break;
			case COMPONENT.VOLUME_GROUP:
				var lcpRegion = getValueFromList(FIELD.ID.LCP_REGION, parameterList);
				if (lcpRegion === FIELD.KEY.LCP_REGION_TEXT) {
					lcpRegion = getValueFromList(FIELD.ID.LCP_REGION_TEXT,
							parameterList);
				}
				requestDetails.cloudConfiguration = {
						lcpCloudRegionId : lcpRegion,
						tenantId : getValueFromList(FIELD.ID.TENANT, parameterList)
				};	
				
				break;
			default:
				requestDetails.cloudConfiguration = {
					lcpCloudRegionId : DataService.getLcpRegion(),
					tenantId : DataService.getTenant()
				};
		}
		return requestDetails;
    }
    
    var getLcpRegion = function() {
		var cloudRegionTenantList = DataService.getCloudRegionTenantList();
		var parameter = FIELD.PARAMETER.LCP_REGION;
		parameter.optionList = new Array();
		for (var i = 0; i < cloudRegionTenantList.length; i++) {
			for (var j = 0; j < parameter.optionList.length; j++) {
				if (parameter.optionList[j].id === cloudRegionTenantList[i].cloudRegionId) {
					break;
				}
			}
			if (j < parameter.optionList.length) {
				continue;
			}
			parameter.optionList.push({
				id : cloudRegionTenantList[i].cloudRegionId
			});
		}
		return parameter;
	};
	
	var getTenantList = function(cloudRegionId) {
		var cloudRegionTenantList = DataService.getCloudRegionTenantList();
		var parameter = FIELD.PARAMETER.TENANT_ENABLED;
		parameter.optionList = new Array();
		for (var i = 0; i < cloudRegionTenantList.length; i++) {
			if (cloudRegionTenantList[i].cloudRegionId === cloudRegionId) {
				parameter.optionList.push({
					id : cloudRegionTenantList[i].tenantId,
					name : cloudRegionTenantList[i].tenantName
				});
			}
		}
		return parameter;

	};

	var addOptionList = function(parameter, optionSimpleArray) {
		var optionList = new Array();
		if (!angular.isArray(optionSimpleArray)) {
			return optionList;
		}
		for (var i = 0; i < optionSimpleArray.length; i++) {
			optionList.push({
				name : optionSimpleArray[i]
			});
		}
		parameter.optionList = optionList;
		return parameter;
	};

    var getValueFromList = function(id, parameterList) {
		for (var i = 0; i < parameterList.length; i++) {
			if (parameterList[i].id === id) {
				return parameterList[i].value;
			}
		}
	};

	var updateUserParameterList = function(updatedId, parameterListControl) {
		if (updatedId === FIELD.ID.LCP_REGION) {
			var list = parameterListControl.getList(updatedId);
			if (list[0].selectedIndex >= 0) {
				parameterListControl
						.updateList([ getTenantList(list[0].value) ]);
			} else {
				parameterListControl
						.updateList([ FIELD.PARAMETER.TENANT_DISABLED ]);
			}
			if (list[0].value === FIELD.KEY.LCP_REGION_TEXT) {
				parameterListControl
						.updateList([ FIELD.PARAMETER.LCP_REGION_TEXT_VISIBLE ]);
			} else {
				parameterListControl
						.updateList([ FIELD.PARAMETER.LCP_REGION_TEXT_HIDDEN ]);
			}
		} else if (updatedId === FIELD.ID.SUBSCRIBER_NAME) {
			var list = parameterListControl.getList(updatedId);
			if (list[0].selectedIndex >= 0) {
				DataService.setGlobalCustomerId(list[0].value);

				AaiService.getSubscriptionServiceTypeList(DataService
						.getGlobalCustomerId(), function(response) {
					DataService.setSubscriptionServiceTypeList(response);
					var serviceTypeParameters = FIELD.PARAMETER.SERVICE_TYPE;
					serviceTypeParameters.optionList = [];

					for (var i = 0; i < response.length; i++) {
						serviceTypeParameters.optionList.push({
							"id" : response[i],
							"name" : response[i]
						});
					}
					parameterListControl.updateList([ serviceTypeParameters ]);
				});

			} else {
				parameterListControl
						.updateList([ FIELD.PARAMETER.SERVICE_TYPE_DISABLED ]);
			}
		}
	};

    return {
	initializeComponent : function(componentId) {
	    _this.componentId = ComponentService.initialize(componentId);
	},
	getComponentDisplayName : ComponentService.getComponentDisplayName,
	getSummaryList : getSummaryList,
	getParameters : function(getParametersHandler) {
		_this.getParametersHandler = getParametersHandler;
		UtilityService.setHttpErrorHandler(_this.httpErrorHandler);
		UtilityService.startAsyncOperations(getAsyncOperationList(),
				internalGetParametersHandler);
	},
	updateUserParameterList : updateUserParameterList,
	getMsoRequestDetails : getMsoRequestDetails,
	getMsoUrl : getMsoUrl
    }
}

app.factory("DeletionService", [ "$log", "AaiService", "AsdcService",
	"DataService", "ComponentService", "COMPONENT", "FIELD",
	"UtilityService", DeletionService ]);
