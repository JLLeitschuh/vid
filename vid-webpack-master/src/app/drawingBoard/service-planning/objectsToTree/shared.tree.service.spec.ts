import {HttpClientTestingModule} from "@angular/common/http/testing";
import {getTestBed, TestBed} from "@angular/core/testing";
import {MockNgRedux, NgReduxTestingModule} from "@angular-redux/store/testing";
import {SharedTreeService} from "./shared.tree.service";
import {ObjectToInstanceTreeService} from "./objectToInstanceTree/objectToInstanceTree.service";
import {ObjectToTreeService} from "./objectToTree.service";
import {DefaultDataGeneratorService} from "../../../shared/services/defaultDataServiceGenerator/default.data.generator.service";
import {DynamicInputsService} from "./dynamicInputs.service";
import {DialogService} from "ng2-bootstrap-modal";
import {VnfPopupService} from "../../../shared/components/genericFormPopup/genericFormServices/vnf/vnf.popup.service";
import {BasicControlGenerator} from "../../../shared/components/genericForm/formControlsServices/basic.control.generator";
import {AaiService} from "../../../shared/services/aaiService/aai.service";
import {NetworkPopupService} from "../../../shared/components/genericFormPopup/genericFormServices/network/network.popup.service";
import {NetworkControlGenerator} from "../../../shared/components/genericForm/formControlsServices/networkGenerator/network.control.generator";
import {VfModulePopuopService} from "../../../shared/components/genericFormPopup/genericFormServices/vfModule/vfModule.popuop.service";
import {VfModuleControlGenerator} from "../../../shared/components/genericForm/formControlsServices/vfModuleGenerator/vfModule.control.generator";
import {VnfGroupControlGenerator} from "../../../shared/components/genericForm/formControlsServices/vnfGroupGenerator/vnfGroup.control.generator";
import {FeatureFlagsService} from "../../../shared/services/featureFlag/feature-flags.service";
import {VnfControlGenerator} from "../../../shared/components/genericForm/formControlsServices/vnfGenerator/vnf.control.generator";
import {NgRedux} from "@angular-redux/store";
import {GenericFormService} from "../../../shared/components/genericForm/generic-form.service";
import {FormBuilder} from "@angular/forms";
import {SdcUiComponentsModule} from "onap-ui-angular";
import {LogService} from "../../../shared/utils/log/log.service";
import {IframeService} from "../../../shared/utils/iframe.service";
import {BasicPopupService} from "../../../shared/components/genericFormPopup/genericFormServices/basic.popup.service";
import {VnfGroupPopupService} from "../../../shared/components/genericFormPopup/genericFormServices/vnfGroup/vnfGroup.popup.service";
import {DuplicateService} from "../duplicate/duplicate.service";
import {AppState} from "../../../shared/store/reducers";
import {MessageBoxService} from "../../../shared/components/messageBox/messageBox.service";
import {ErrorMsgService} from "../../../shared/components/error-msg/error-msg.service";
import {AuditInfoModalComponent} from "../../../shared/components/auditInfoModal/auditInfoModal.component";
import {ILevelNodeInfo} from "./models/basic.model.info";
import {VnfModelInfo} from "./models/vnf/vnf.model.info";
import {ServiceInstanceActions} from "../../../shared/models/serviceInstanceActions";
import each from "jest-each";
import {DrawingBoardModes} from "../drawing-board.modes";
import {ComponentInfoService} from "../component-info/component-info.service";

class MockAppStore<T> {
  getState() {
    return getStore()
  }

  dispatch() {
  }
}

class MockVnfModelInfo<T> {
  getModel() {
    return {}
  }
}


describe('Shared Tree Service', () => {
  let injector;
  let service: SharedTreeService;
  let _objectToInstanceTreeService: ObjectToInstanceTreeService;
  let store: NgRedux<AppState>;
  beforeAll(done => (async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgReduxTestingModule, SdcUiComponentsModule],
      providers: [
        SharedTreeService,
        ObjectToTreeService,
        DefaultDataGeneratorService,
        DialogService,
        VnfPopupService,
        BasicControlGenerator,
        AaiService,
        LogService,
        BasicPopupService,
        VnfGroupPopupService,
        DuplicateService,
        IframeService,
        DynamicInputsService,
        NetworkPopupService,
        NetworkControlGenerator,
        VfModulePopuopService,
        VfModuleControlGenerator,
        VnfGroupControlGenerator,
        DialogService,
        FeatureFlagsService,
        VnfControlGenerator,
        AaiService,
        DialogService,
        GenericFormService,
        FormBuilder,
        ErrorMsgService,
        ObjectToInstanceTreeService,
        ComponentInfoService,
        {provide: NgRedux, useClass: MockAppStore}
      ]
    });
    await TestBed.compileComponents();
    injector = getTestBed();
    service = injector.get(SharedTreeService);
    _objectToInstanceTreeService = injector.get(ObjectToInstanceTreeService);
    store = injector.get(NgRedux);
  })().then(done).catch(done.fail));

  test('SharedTreeService should be defined', () => {
    expect(service).toBeDefined();
  });

  test('shouldShowDeleteInstanceWithChildrenModal should open modal if child exist with action create', () => {
    jest.spyOn(MessageBoxService.openModal, 'next');
    let foo = () => {

    };
    let node = <any>{
      children: [{action: "Create"}, {action: "None"}],
      data: {
        typeName: 'VNF'
      }
    };
    service.shouldShowDeleteInstanceWithChildrenModal(node, "serviceModelId", foo);
    expect(MessageBoxService.openModal.next).toHaveBeenCalled();
  });

  test('openAuditInfoModal should open modal for failed instance', () => {
    jest.spyOn(AuditInfoModalComponent.openInstanceAuditInfoModal, 'next');

    let modelInfoServiceMock: ILevelNodeInfo = new VnfModelInfo(null, null, null, null, null, null, null, null, null, null);
    const modelMock = {"a": "a"};
    const instanceMock = {"instance": "instance", "trackById": "123456789"};
    const instanceTypeMock = "instanceTypeMock";
    jest.spyOn(modelInfoServiceMock, 'getModel').mockReturnValue(modelMock);
    let node = <any>{
      data: {
        modelId: '6b528779-44a3-4472-bdff-9cd15ec93450',
        trackById: '1245df21',
        isFailed: true
      }
    };
    service.openAuditInfoModal(node, "serviceModelId", instanceMock, instanceTypeMock, <any>modelInfoServiceMock);
    expect(AuditInfoModalComponent.openInstanceAuditInfoModal.next).toHaveBeenCalledWith(
      {
        "instance": instanceMock,
        "instanceId": "serviceModelId",
        "isInstanceFailed": node.data.isFailed,
        "model": modelMock,
        "trackById": instanceMock.trackById,
        "type": instanceTypeMock
      });
  });

  test('shouldShowDeleteInstanceWithChildrfenModal should not open modal if all childs with action None', () => {
    let foo = () => {
    };
    spyOn(MessageBoxService.openModal, 'next');

    let node = <any>{
      children: [{action: "None"}, {action: "None"}],
      data: {
        typeName: 'VNF'
      }
    };
    service.shouldShowDeleteInstanceWithChildrenModal(node, "serviceModelId", foo);
    expect(MessageBoxService.openModal.next).not.toHaveBeenCalled();
  });

  test('statusProperties should be prop on node according to node properties', () => {
    let node = service.addingStatusProperty({orchStatus: 'completed', provStatus: 'inProgress', inMaint: false});
    expect(node.statusProperties).toBeDefined();
    expect(node.statusProperties).toEqual([Object({
      key: 'Prov Status:',
      value: 'inProgress',
      testId: 'provStatus'
    }), Object({key: 'Orch Status:', value: 'completed', testId: 'orchStatus'})]);
    node = service.addingStatusProperty({orchStatus: 'completed', provStatus: 'inProgress', inMaint: true});
    expect(node.statusProperties).toEqual([Object({
      key: 'Prov Status:',
      value: 'inProgress',
      testId: 'provStatus'
    }), Object({key: 'Orch Status:', value: 'completed', testId: 'orchStatus'}), Object({
      key: 'In-maintenance',
      value: '',
      testId: 'inMaint'
    })]);
  });
  const enableRemoveAndEditItemsDataProvider = [
    ['Create action CREATE mode', DrawingBoardModes.CREATE ,ServiceInstanceActions.Create, true],
    ['Create action VIEW mode',DrawingBoardModes.VIEW , ServiceInstanceActions.Create,false],
    ['Create action RETRY_EDIT mode',DrawingBoardModes.RETRY_EDIT,  ServiceInstanceActions.Create,  true],
    ['Create action EDIT mode',DrawingBoardModes.EDIT, ServiceInstanceActions.Create,  true],
    ['Create action RETRY mode',DrawingBoardModes.RETRY, ServiceInstanceActions.Create,  false],
    ['None action EDIT mode',DrawingBoardModes.EDIT,  ServiceInstanceActions.None, false],
    ['None action RETRY_EDIT mode', DrawingBoardModes.RETRY_EDIT, ServiceInstanceActions.None, false]];
  each(enableRemoveAndEditItemsDataProvider).test('shouldShowEditAndDelete if child exist with %s', (description, mode, action, enabled) => {
    jest.spyOn(store, 'getState').mockReturnValue({
        global: {
          drawingBoardStatus: mode
        }
      });
      let node = <any>{
        data:{
          action: action
        },
      };
      let res = service.shouldShowRemoveAndEdit(node);
      expect(res).toBe(enabled);
    });
});
function generateService() {
  return {
    "vnfs": {
      "2017-488_ADIOD-vPE 0": {
        "inMaint": false,
        "rollbackOnFailure": "true",
        "originalName": "2017-488_ADIOD-vPE 0",
        "isMissingData": false,
        "trackById": "stigekyxrqi",
        "vfModules": {
          "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_base_vPE_BV..module-0": {
            "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_base_vPE_BV..module-0gytfi": {
              "isMissingData": false,
              "sdncPreReload": null,
              "modelInfo": {
                "modelType": "VFmodule",
                "modelInvariantId": "b34833bb-6aa9-4ad6-a831-70b06367a091",
                "modelVersionId": "f8360508-3f17-4414-a2ed-6bc71161e8db",
                "modelName": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0",
                "modelVersion": "5",
                "modelCustomizationId": "a55961b2-2065-4ab0-a5b7-2fcee1c227e3",
                "modelCustomizationName": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0"
              },
              "instanceParams": [{}],
              "trackById": "3oj23o7nupo"
            }
          }
        },
        "vnfStoreKey": "2017-488_ADIOD-vPE 0",
        "uuid": "69e09f68-8b63-4cc9-b9ff-860960b5db09",
        "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
        "lcpCloudRegionId": "JANET25",
        "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
        "lineOfBusiness": "ONAP",
        "platformName": "xxx1",
        "modelInfo": {
          "modelInvariantId": "72e465fe-71b1-4e7b-b5ed-9496118ff7a8",
          "modelVersionId": "69e09f68-8b63-4cc9-b9ff-860960b5db09",
          "modelName": "2017-488_ADIOD-vPE",
          "modelVersion": "5.0",
          "modelCustomizationName": "2017-488_ADIOD-vPE 0",
          "modelCustomizationId": "1da7b585-5e61-4993-b95e-8e6606c81e45",
          "uuid": "69e09f68-8b63-4cc9-b9ff-860960b5db09"
        },
        "legacyRegion": "11111111",
        "instanceParams": [{}]
      },
      "2017-388_ADIOD-vPE 0": {
        "inMaint": false,
        "rollbackOnFailure": "true",
        "originalName": "2017-388_ADIOD-vPE 0",
        "isMissingData": false,
        "trackById": "nib719t5vca",
        "vfModules": {},
        "vnfStoreKey": "2017-388_ADIOD-vPE 0",
        "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
        "lcpCloudRegionId": "JANET25",
        "legacyRegion": "11111",
        "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
        "platformName": "platform",
        "lineOfBusiness": "zzz1",
        "instanceParams": [{}],
        "modelInfo": {
          "modelInvariantId": "72e465fe-71b1-4e7b-b5ed-9496118ff7a8",
          "modelVersionId": "afacccf6-397d-45d6-b5ae-94c39734b168",
          "modelName": "2017-388_ADIOD-vPE",
          "modelVersion": "4.0",
          "modelCustomizationId": "b3c76f73-eeb5-4fb6-9d31-72a889f1811c",
          "modelCustomizationName": "2017-388_ADIOD-vPE 0",
          "uuid": "afacccf6-397d-45d6-b5ae-94c39734b168"
        },
        "uuid": "afacccf6-397d-45d6-b5ae-94c39734b168"
      },
      "2017-388_ADIOD-vPE 1": {
        "inMaint": false,
        "rollbackOnFailure": "true",
        "originalName": "2017-388_ADIOD-vPE 1",
        "isMissingData": false,
        "trackById": "cv7l1ak8vpe",
        "vfModules": {},
        "vnfStoreKey": "2017-388_ADIOD-vPE 1",
        "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
        "lcpCloudRegionId": "JANET25",
        "legacyRegion": "123",
        "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
        "platformName": "platform",
        "lineOfBusiness": "ONAP",
        "instanceParams": [{}],
        "modelInfo": {
          "modelInvariantId": "00beb8f9-6d39-452f-816d-c709b9cbb87d",
          "modelVersionId": "0903e1c0-8e03-4936-b5c2-260653b96413",
          "modelName": "2017-388_ADIOD-vPE",
          "modelVersion": "1.0",
          "modelCustomizationId": "280dec31-f16d-488b-9668-4aae55d6648a",
          "modelCustomizationName": "2017-388_ADIOD-vPE 1",
          "uuid": "0903e1c0-8e03-4936-b5c2-260653b96413"
        },
        "uuid": "0903e1c0-8e03-4936-b5c2-260653b96413"
      }
    },
    "instanceParams": [{}],
    "validationCounter": 0,
    "existingNames": {"yoav": ""},
    "existingVNFCounterMap": {
      "69e09f68-8b63-4cc9-b9ff-860960b5db09": 1,
      "afacccf6-397d-45d6-b5ae-94c39734b168": 1,
      "0903e1c0-8e03-4936-b5c2-260653b96413": 1
    },
    "existingVnfGroupCounterMap": {
      "daeb6568-cef8-417f-9075-ed259ce59f48": 0,
      "c2b300e6-45de-4e5e-abda-3032bee2de56": -1
    },
    "existingNetworksCounterMap": {"ddc3f20c-08b5-40fd-af72-c6d14636b986": 1},
    "networks": {
      "ExtVL 0": {
        "inMaint": false,
        "rollbackOnFailure": "true",
        "originalName": "ExtVL 0",
        "isMissingData": false,
        "trackById": "s6okajvv2n8",
        "networkStoreKey": "ExtVL 0",
        "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
        "lcpCloudRegionId": "JANET25",
        "legacyRegion": "12355555",
        "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
        "platformName": "platform",
        "lineOfBusiness": null,
        "instanceParams": [{}],
        "modelInfo": {
          "modelInvariantId": "379f816b-a7aa-422f-be30-17114ff50b7c",
          "modelVersionId": "ddc3f20c-08b5-40fd-af72-c6d14636b986",
          "modelName": "ExtVL",
          "modelVersion": "37.0",
          "modelCustomizationId": "94fdd893-4a36-4d70-b16a-ec29c54c184f",
          "modelCustomizationName": "ExtVL 0",
          "uuid": "ddc3f20c-08b5-40fd-af72-c6d14636b986"
        },
        "uuid": "ddc3f20c-08b5-40fd-af72-c6d14636b986"
      }
    },
    "vnfGroups": {
      "groupingservicefortest..ResourceInstanceGroup..0": {
        "inMaint": false,
        "rollbackOnFailure": "true",
        "originalName": "groupingservicefortest..ResourceInstanceGroup..0",
        "isMissingData": false,
        "trackById": "se0obn93qq",
        "vnfGroupStoreKey": "groupingservicefortest..ResourceInstanceGroup..0",
        "instanceName": "groupingservicefortestResourceInstanceGroup0",
        "instanceParams": [{}],
        "modelInfo": {
          "modelInvariantId": "4bb2e27e-ddab-4790-9c6d-1f731bc14a45",
          "modelVersionId": "daeb6568-cef8-417f-9075-ed259ce59f48",
          "modelName": "groupingservicefortest..ResourceInstanceGroup..0",
          "modelVersion": "1",
          "modelCustomizationName": "groupingservicefortest..ResourceInstanceGroup..0",
          "uuid": "daeb6568-cef8-417f-9075-ed259ce59f48"
        },
        "uuid": "daeb6568-cef8-417f-9075-ed259ce59f48"
      }
    },
    "instanceName": "yoav",
    "globalSubscriberId": "e433710f-9217-458d-a79d-1c7aff376d89",
    "subscriptionServiceType": "TYLER SILVIA",
    "owningEntityId": "d61e6f2d-12fa-4cc2-91df-7c244011d6fc",
    "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
    "lcpCloudRegionId": "JANET25",
    "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
    "aicZoneId": "ATL53",
    "pause": null,
    "projectName": "WATKINS",
    "rollbackOnFailure": "true",
    "bulkSize": 1,
    "aicZoneName": "AAIATLTE-ATL53",
    "owningEntityName": "WayneHolland",
    "testApi": "VNF_API",
    "isEcompGeneratedNaming": false,
    "tenantName": "USP-SIP-IC-24335-T-01",
    "modelInfo": {
      "modelInvariantId": "cdb90b57-ed78-4d44-a5b4-7f43a02ec632",
      "modelVersionId": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd",
      "modelName": "action-data",
      "modelVersion": "1.0",
      "uuid": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd"
    },
    "isALaCarte": false,
    "name": "action-data",
    "version": "1.0",
    "description": "ADIOD vMX vPE based on Juniper 17.2 release. Updated with updated VF for v8.0 of VLM",
    "category": "Network L1-3",
    "uuid": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd",
    "invariantUuid": "cdb90b57-ed78-4d44-a5b4-7f43a02ec632",
    "serviceType": "pnf",
    "serviceRole": "Testing",
    "vidNotions": {"instantiationUI": "legacy", "modelCategory": "other", "viewEditUI": "legacy"},
    "isMultiStepDesign": true
  };
}

function getStore() {
  return {
    "global": {
      "name": null,
      "flags": {
        "CREATE_INSTANCE_TEST": false,
        "EMPTY_DRAWING_BOARD_TEST": false,
        "FLAG_NETWORK_TO_ASYNC_INSTANTIATION": false,
        "FLAG_ASYNC_INSTANTIATION": true,
        "FLAG_ASYNC_JOBS": true,
        "FLAG_ADD_MSO_TESTAPI_FIELD": true,
        "FLAG_UNASSIGN_SERVICE": true,
        "FLAG_SERVICE_MODEL_CACHE": true,
        "FLAG_COLLECTION_RESOURCE_SUPPORT": true,
        "FLAG_SHOW_ASSIGNMENTS": true,
        "FLAG_FABRIC_CONFIGURATION_ASSIGNMENTS": true,
        "FLAG_DUPLICATE_VNF": true,
        "FLAG_DEFAULT_VNF": true,
        "FLAG_SETTING_DEFAULTS_IN_DRAWING_BOARD": true,
        "FLAG_A_LA_CARTE_AUDIT_INFO": true,
        "FLAG_1810_CR_ADD_CLOUD_OWNER_TO_MSO_REQUEST": true,
        "FLAG_PRESENT_PROVIDER_NETWORKS_ASSOCIATIONS": true,
        "FLAG_1810_CR_SOFT_DELETE_ALACARTE_VF_MODULE": true,
        "FLAG_1902_NEW_VIEW_EDIT": true,
        "FLAG_1810_IDENTIFY_SERVICE_FOR_NEW_UI": false,
        "FLAG_1902_VNF_GROUPING": true,
        "FLAG_SHOW_VERIFY_SERVICE": true,
        "FLAG_ASYNC_ALACARTE_VFMODULE": true,
        "FLAG_ASYNC_ALACARTE_VNF": true,
        "FLAG_SHIFT_VFMODULE_PARAMS_TO_VNF": true,
        "FLAG_1810_AAI_LOCAL_CACHE": true,
        "FLAG_EXP_USE_DEFAULT_HOST_NAME_VERIFIER": false,
        "FLAG_EXP_ANY_ALACARTE_NEW_INSTANTIATION_UI": false,
        "FLAG_SUPPLEMENTARY_FILE": true,
        "FLAG_5G_IN_NEW_INSTANTIATION_UI": true,
        "FLAG_RESTRICTED_SELECT": false,
        "FLAG_1810_CR_LET_SELECTING_COLLECTOR_TYPE_UNCONDITIONALLY": true
      },
      "drawingBoardStatus": "VIEW",
      "type": "UPDATE_DRAWING_BOARD_STATUS"
    },
    "service": {
      "serviceHierarchy": {
        "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd": {
          "service": {
            "uuid": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd",
            "invariantUuid": "cdb90b57-ed78-4d44-a5b4-7f43a02ec632",
            "name": "action-data",
            "version": "1.0",
            "toscaModelURL": null,
            "category": "Network L1-3",
            "serviceType": "pnf",
            "serviceRole": "Testing",
            "description": "ADIOD vMX vPE based on Juniper 17.2 release. Updated with updated VF for v8.0 of VLM",
            "serviceEcompNaming": "false",
            "instantiationType": "Macro",
            "inputs": {},
            "vidNotions": {"instantiationUI": "legacy", "modelCategory": "other", "viewEditUI": "legacy"}
          },
          "vnfs": {
            "2017-388_ADIOD-vPE 1": {
              "uuid": "0903e1c0-8e03-4936-b5c2-260653b96413",
              "invariantUuid": "00beb8f9-6d39-452f-816d-c709b9cbb87d",
              "description": "Name ADIOD vPE Description The provider edge function for the ADIOD service supported by the Junipers VMX product Category Router Vendor Juniper Vendor Release Code 17.2 Owners Mary Fragale. Updated 9-25 to use v8.0 of the Juniper Valid 2 VLM",
              "name": "2017-388_ADIOD-vPE",
              "version": "1.0",
              "customizationUuid": "280dec31-f16d-488b-9668-4aae55d6648a",
              "inputs": {},
              "commands": {},
              "properties": {
                "vmxvre_retype": "RE-VMX",
                "vnf_config_template_version": "get_input:2017488_adiodvpe0_vnf_config_template_version",
                "sriov44_net_id": "48d399b3-11ee-48a8-94d2-f0ea94d6be8d",
                "int_ctl_net_id": "2f323477-6936-4d01-ac53-d849430281d9",
                "vmxvpfe_sriov41_0_port_mac": "00:11:22:EF:AC:DF",
                "int_ctl_net_name": "VMX-INTXI",
                "vmx_int_ctl_prefix": "10.0.0.10",
                "sriov43_net_id": "da349ca1-6de9-4548-be88-2d88e99bfef5",
                "sriov42_net_id": "760669ba-013d-4d9b-b0e7-4151fe2e6279",
                "sriov41_net_id": "25ad52d5-c165-40f8-b3b0-ddfc2373280a",
                "nf_type": "vPE",
                "vmxvpfe_int_ctl_ip_1": "10.0.0.10",
                "is_AVPN_service": "false",
                "vmx_RSG_name": "vREXI-affinity",
                "vmx_int_ctl_forwarding": "l2",
                "vmxvre_oam_ip_0": "10.0.0.10",
                "vmxvpfe_sriov44_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvpfe_sriov41_0_port_vlanstrip": "false",
                "vmxvpfe_sriov42_0_port_vlanfilter": "4001",
                "vmxvpfe_sriov44_0_port_unknownunicastallow": "true",
                "vmxvre_image_name_0": "VRE-ENGINE_17.2-S2.1.qcow2",
                "vmxvre_instance": "0",
                "vmxvpfe_sriov43_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvre_flavor_name": "ns.c1r16d32.v5",
                "vmxvpfe_volume_size_0": "40.0",
                "vmxvpfe_sriov43_0_port_vlanfilter": "4001",
                "nf_naming": "{ecomp_generated_naming=true}",
                "multi_stage_design": "true",
                "nf_naming_code": "Navneet",
                "vmxvre_name_0": "vREXI",
                "vmxvpfe_sriov42_0_port_vlanstrip": "false",
                "vmxvpfe_volume_name_0": "vPFEXI_FBVolume",
                "vmx_RSG_id": "bd89a33c-13c3-4a04-8fde-1a57eb123141",
                "vmxvpfe_image_name_0": "VPE_ROUTING-ENGINE_17.2R1-S2.1.qcow2",
                "vmxvpfe_sriov43_0_port_unknownunicastallow": "true",
                "vmxvpfe_sriov44_0_port_unknownmulticastallow": "true",
                "vmxvre_console": "vidconsole",
                "vmxvpfe_sriov44_0_port_vlanfilter": "4001",
                "vmxvpfe_sriov42_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvpfe_volume_id_0": "47cede15-da2f-4397-a101-aa683220aff3",
                "vmxvpfe_sriov42_0_port_unknownmulticastallow": "true",
                "vmxvpfe_sriov44_0_port_vlanstrip": "false",
                "vf_module_id": "123",
                "nf_function": "JAI",
                "vmxvpfe_sriov43_0_port_unknownmulticastallow": "true",
                "vmxvre_int_ctl_ip_0": "10.0.0.10",
                "ecomp_generated_naming": "true",
                "AIC_CLLI": "get_input:2017488_adiodvpe0_AIC_CLLI",
                "vnf_name": "mtnj309me6vre",
                "vmxvpfe_sriov41_0_port_unknownunicastallow": "true",
                "vmxvre_volume_type_1": "HITACHI",
                "vmxvpfe_sriov44_0_port_broadcastallow": "true",
                "vmxvre_volume_type_0": "HITACHI",
                "vmxvpfe_volume_type_0": "HITACHI",
                "vmxvpfe_sriov43_0_port_broadcastallow": "true",
                "bandwidth_units": "get_input:2017488_adiodvpe0_bandwidth_units",
                "vnf_id": "123",
                "vmxvre_oam_prefix": "24",
                "availability_zone_0": "mtpocfo-kvm-az01",
                "ASN": "get_input:2017488_adiodvpe0_ASN",
                "vmxvre_chassis_i2cid": "161",
                "vmxvpfe_name_0": "vPFEXI",
                "bandwidth": "get_input:2017488_adiodvpe0_bandwidth",
                "availability_zone_max_count": "1",
                "vmxvre_volume_size_0": "45.0",
                "vmxvre_volume_size_1": "50.0",
                "vmxvpfe_sriov42_0_port_broadcastallow": "true",
                "vmxvre_oam_gateway": "10.0.0.10",
                "vmxvre_volume_name_1": "vREXI_FAVolume",
                "vmxvre_ore_present": "0",
                "vmxvre_volume_name_0": "vREXI_FBVolume",
                "vmxvre_type": "0",
                "vnf_instance_name": "get_input:2017488_adiodvpe0_vnf_instance_name",
                "vmxvpfe_sriov41_0_port_unknownmulticastallow": "true",
                "oam_net_id": "b95eeb1d-d55d-4827-abb4-8ebb94941429",
                "vmx_int_ctl_len": "24",
                "vmxvpfe_sriov43_0_port_vlanstrip": "false",
                "vmxvpfe_sriov41_0_port_broadcastallow": "true",
                "vmxvre_volume_id_1": "6e86797e-03cd-4fdc-ba72-2957119c746d",
                "vmxvpfe_sriov41_0_port_vlanfilter": "4001",
                "nf_role": "Testing",
                "vmxvre_volume_id_0": "f4eacb79-f687-4e9d-b760-21847c8bb15a",
                "vmxvpfe_sriov42_0_port_unknownunicastallow": "true",
                "vmxvpfe_flavor_name": "ns.c20r16d25.v5"
              },
              "type": "VF",
              "modelCustomizationName": "2017-388_ADIOD-vPE 1",
              "vfModules": {},
              "volumeGroups": {},
              "vfcInstanceGroups": {}
            },
            "2017-388_ADIOD-vPE 0": {
              "uuid": "afacccf6-397d-45d6-b5ae-94c39734b168",
              "invariantUuid": "72e465fe-71b1-4e7b-b5ed-9496118ff7a8",
              "description": "Name ADIOD vPE Description The provider edge function for the ADIOD service supported by the Junipers VMX product Category Router Vendor Juniper Vendor Release Code 17.2 Owners Mary Fragale. Updated 9-25 to use v8.0 of the Juniper Valid 2 VLM",
              "name": "2017-388_ADIOD-vPE",
              "version": "4.0",
              "customizationUuid": "b3c76f73-eeb5-4fb6-9d31-72a889f1811c",
              "inputs": {},
              "commands": {},
              "properties": {
                "vmxvre_retype": "RE-VMX",
                "vnf_config_template_version": "get_input:2017488_adiodvpe0_vnf_config_template_version",
                "sriov44_net_id": "48d399b3-11ee-48a8-94d2-f0ea94d6be8d",
                "int_ctl_net_id": "2f323477-6936-4d01-ac53-d849430281d9",
                "vmxvpfe_sriov41_0_port_mac": "00:11:22:EF:AC:DF",
                "int_ctl_net_name": "VMX-INTXI",
                "vmx_int_ctl_prefix": "10.0.0.10",
                "sriov43_net_id": "da349ca1-6de9-4548-be88-2d88e99bfef5",
                "sriov42_net_id": "760669ba-013d-4d9b-b0e7-4151fe2e6279",
                "sriov41_net_id": "25ad52d5-c165-40f8-b3b0-ddfc2373280a",
                "nf_type": "vPE",
                "vmxvpfe_int_ctl_ip_1": "10.0.0.10",
                "is_AVPN_service": "false",
                "vmx_RSG_name": "vREXI-affinity",
                "vmx_int_ctl_forwarding": "l2",
                "vmxvre_oam_ip_0": "10.0.0.10",
                "vmxvpfe_sriov44_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvpfe_sriov41_0_port_vlanstrip": "false",
                "vmxvpfe_sriov42_0_port_vlanfilter": "4001",
                "vmxvpfe_sriov44_0_port_unknownunicastallow": "true",
                "vmxvre_image_name_0": "VRE-ENGINE_17.2-S2.1.qcow2",
                "vmxvre_instance": "0",
                "vmxvpfe_sriov43_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvre_flavor_name": "ns.c1r16d32.v5",
                "vmxvpfe_volume_size_0": "40.0",
                "vmxvpfe_sriov43_0_port_vlanfilter": "4001",
                "nf_naming": "{ecomp_generated_naming=true}",
                "multi_stage_design": "true",
                "nf_naming_code": "Navneet",
                "vmxvre_name_0": "vREXI",
                "vmxvpfe_sriov42_0_port_vlanstrip": "false",
                "vmxvpfe_volume_name_0": "vPFEXI_FBVolume",
                "vmx_RSG_id": "bd89a33c-13c3-4a04-8fde-1a57eb123141",
                "vmxvpfe_image_name_0": "VPE_ROUTING-ENGINE_17.2R1-S2.1.qcow2",
                "vmxvpfe_sriov43_0_port_unknownunicastallow": "true",
                "vmxvpfe_sriov44_0_port_unknownmulticastallow": "true",
                "vmxvre_console": "vidconsole",
                "vmxvpfe_sriov44_0_port_vlanfilter": "4001",
                "vmxvpfe_sriov42_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvpfe_volume_id_0": "47cede15-da2f-4397-a101-aa683220aff3",
                "vmxvpfe_sriov42_0_port_unknownmulticastallow": "true",
                "vmxvpfe_sriov44_0_port_vlanstrip": "false",
                "vf_module_id": "123",
                "nf_function": "JAI",
                "vmxvpfe_sriov43_0_port_unknownmulticastallow": "true",
                "vmxvre_int_ctl_ip_0": "10.0.0.10",
                "ecomp_generated_naming": "true",
                "AIC_CLLI": "get_input:2017488_adiodvpe0_AIC_CLLI",
                "vnf_name": "mtnj309me6vre",
                "vmxvpfe_sriov41_0_port_unknownunicastallow": "true",
                "vmxvre_volume_type_1": "HITACHI",
                "vmxvpfe_sriov44_0_port_broadcastallow": "true",
                "vmxvre_volume_type_0": "HITACHI",
                "vmxvpfe_volume_type_0": "HITACHI",
                "vmxvpfe_sriov43_0_port_broadcastallow": "true",
                "bandwidth_units": "get_input:2017488_adiodvpe0_bandwidth_units",
                "vnf_id": "123",
                "vmxvre_oam_prefix": "24",
                "availability_zone_0": "mtpocfo-kvm-az01",
                "ASN": "get_input:2017488_adiodvpe0_ASN",
                "vmxvre_chassis_i2cid": "161",
                "vmxvpfe_name_0": "vPFEXI",
                "bandwidth": "get_input:2017488_adiodvpe0_bandwidth",
                "availability_zone_max_count": "1",
                "vmxvre_volume_size_0": "45.0",
                "vmxvre_volume_size_1": "50.0",
                "vmxvpfe_sriov42_0_port_broadcastallow": "true",
                "vmxvre_oam_gateway": "10.0.0.10",
                "vmxvre_volume_name_1": "vREXI_FAVolume",
                "vmxvre_ore_present": "0",
                "vmxvre_volume_name_0": "vREXI_FBVolume",
                "vmxvre_type": "0",
                "vnf_instance_name": "get_input:2017488_adiodvpe0_vnf_instance_name",
                "vmxvpfe_sriov41_0_port_unknownmulticastallow": "true",
                "oam_net_id": "b95eeb1d-d55d-4827-abb4-8ebb94941429",
                "vmx_int_ctl_len": "24",
                "vmxvpfe_sriov43_0_port_vlanstrip": "false",
                "vmxvpfe_sriov41_0_port_broadcastallow": "true",
                "vmxvre_volume_id_1": "6e86797e-03cd-4fdc-ba72-2957119c746d",
                "vmxvpfe_sriov41_0_port_vlanfilter": "4001",
                "nf_role": "Testing",
                "vmxvre_volume_id_0": "f4eacb79-f687-4e9d-b760-21847c8bb15a",
                "vmxvpfe_sriov42_0_port_unknownunicastallow": "true",
                "vmxvpfe_flavor_name": "ns.c20r16d25.v5"
              },
              "type": "VF",
              "modelCustomizationName": "2017-388_ADIOD-vPE 0",
              "vfModules": {},
              "volumeGroups": {},
              "vfcInstanceGroups": {}
            },
            "2017-488_ADIOD-vPE 0": {
              "uuid": "69e09f68-8b63-4cc9-b9ff-860960b5db09",
              "invariantUuid": "72e465fe-71b1-4e7b-b5ed-9496118ff7a8",
              "description": "Name ADIOD vPE Description The provider edge function for the ADIOD service supported by the Junipers VMX product Category Router Vendor Juniper Vendor Release Code 17.2 Owners Mary Fragale. Updated 9-25 to use v8.0 of the Juniper Valid 2 VLM",
              "name": "2017-488_ADIOD-vPE",
              "version": "5.0",
              "customizationUuid": "1da7b585-5e61-4993-b95e-8e6606c81e45",
              "inputs": {},
              "commands": {},
              "properties": {
                "max_instances": 1,
                "vmxvre_retype": "RE-VMX",
                "vnf_config_template_version": "get_input:2017488_adiodvpe0_vnf_config_template_version",
                "sriov44_net_id": "48d399b3-11ee-48a8-94d2-f0ea94d6be8d",
                "int_ctl_net_id": "2f323477-6936-4d01-ac53-d849430281d9",
                "vmxvpfe_sriov41_0_port_mac": "00:11:22:EF:AC:DF",
                "int_ctl_net_name": "VMX-INTXI",
                "vmx_int_ctl_prefix": "10.0.0.10",
                "sriov43_net_id": "da349ca1-6de9-4548-be88-2d88e99bfef5",
                "sriov42_net_id": "760669ba-013d-4d9b-b0e7-4151fe2e6279",
                "sriov41_net_id": "25ad52d5-c165-40f8-b3b0-ddfc2373280a",
                "nf_type": "vPE",
                "vmxvpfe_int_ctl_ip_1": "10.0.0.10",
                "is_AVPN_service": "false",
                "vmx_RSG_name": "vREXI-affinity",
                "vmx_int_ctl_forwarding": "l2",
                "vmxvre_oam_ip_0": "10.0.0.10",
                "vmxvpfe_sriov44_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvpfe_sriov41_0_port_vlanstrip": "false",
                "vmxvpfe_sriov42_0_port_vlanfilter": "4001",
                "vmxvpfe_sriov44_0_port_unknownunicastallow": "true",
                "vmxvre_image_name_0": "VRE-ENGINE_17.2-S2.1.qcow2",
                "vmxvre_instance": "0",
                "vmxvpfe_sriov43_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvre_flavor_name": "ns.c1r16d32.v5",
                "vmxvpfe_volume_size_0": "40.0",
                "vmxvpfe_sriov43_0_port_vlanfilter": "4001",
                "nf_naming": "{ecomp_generated_naming=true}",
                "multi_stage_design": "true",
                "nf_naming_code": "Navneet",
                "vmxvre_name_0": "vREXI",
                "vmxvpfe_sriov42_0_port_vlanstrip": "false",
                "vmxvpfe_volume_name_0": "vPFEXI_FBVolume",
                "vmx_RSG_id": "bd89a33c-13c3-4a04-8fde-1a57eb123141",
                "vmxvpfe_image_name_0": "VPE_ROUTING-ENGINE_17.2R1-S2.1.qcow2",
                "vmxvpfe_sriov43_0_port_unknownunicastallow": "true",
                "vmxvpfe_sriov44_0_port_unknownmulticastallow": "true",
                "vmxvre_console": "vidconsole",
                "vmxvpfe_sriov44_0_port_vlanfilter": "4001",
                "vmxvpfe_sriov42_0_port_mac": "00:11:22:EF:AC:DF",
                "vmxvpfe_volume_id_0": "47cede15-da2f-4397-a101-aa683220aff3",
                "vmxvpfe_sriov42_0_port_unknownmulticastallow": "true",
                "vmxvpfe_sriov44_0_port_vlanstrip": "false",
                "vf_module_id": "123",
                "nf_function": "JAI",
                "vmxvpfe_sriov43_0_port_unknownmulticastallow": "true",
                "vmxvre_int_ctl_ip_0": "10.0.0.10",
                "ecomp_generated_naming": "true",
                "AIC_CLLI": "get_input:2017488_adiodvpe0_AIC_CLLI",
                "vnf_name": "mtnj309me6vre",
                "vmxvpfe_sriov41_0_port_unknownunicastallow": "true",
                "vmxvre_volume_type_1": "HITACHI",
                "vmxvpfe_sriov44_0_port_broadcastallow": "true",
                "vmxvre_volume_type_0": "HITACHI",
                "vmxvpfe_volume_type_0": "HITACHI",
                "vmxvpfe_sriov43_0_port_broadcastallow": "true",
                "bandwidth_units": "get_input:2017488_adiodvpe0_bandwidth_units",
                "vnf_id": "123",
                "vmxvre_oam_prefix": "24",
                "availability_zone_0": "mtpocfo-kvm-az01",
                "ASN": "get_input:2017488_adiodvpe0_ASN",
                "vmxvre_chassis_i2cid": "161",
                "vmxvpfe_name_0": "vPFEXI",
                "bandwidth": "get_input:2017488_adiodvpe0_bandwidth",
                "availability_zone_max_count": "1",
                "vmxvre_volume_size_0": "45.0",
                "vmxvre_volume_size_1": "50.0",
                "vmxvpfe_sriov42_0_port_broadcastallow": "true",
                "vmxvre_oam_gateway": "10.0.0.10",
                "vmxvre_volume_name_1": "vREXI_FAVolume",
                "vmxvre_ore_present": "0",
                "vmxvre_volume_name_0": "vREXI_FBVolume",
                "vmxvre_type": "0",
                "vnf_instance_name": "get_input:2017488_adiodvpe0_vnf_instance_name",
                "vmxvpfe_sriov41_0_port_unknownmulticastallow": "true",
                "oam_net_id": "b95eeb1d-d55d-4827-abb4-8ebb94941429",
                "vmx_int_ctl_len": "24",
                "vmxvpfe_sriov43_0_port_vlanstrip": "false",
                "vmxvpfe_sriov41_0_port_broadcastallow": "true",
                "vmxvre_volume_id_1": "6e86797e-03cd-4fdc-ba72-2957119c746d",
                "vmxvpfe_sriov41_0_port_vlanfilter": "4001",
                "nf_role": "Testing",
                "vmxvre_volume_id_0": "f4eacb79-f687-4e9d-b760-21847c8bb15a",
                "vmxvpfe_sriov42_0_port_unknownunicastallow": "true",
                "vmxvpfe_flavor_name": "ns.c20r16d25.v5"
              },
              "type": "VF",
              "modelCustomizationName": "2017-488_ADIOD-vPE 0",
              "vfModules": {
                "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vRE_BV..module-1": {
                  "uuid": "25284168-24bb-4698-8cb4-3f509146eca5",
                  "invariantUuid": "7253ff5c-97f0-4b8b-937c-77aeb4d79aa1",
                  "customizationUuid": "f7e7c365-60cf-49a9-9ebf-a1aa11b9d401",
                  "description": null,
                  "name": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
                  "version": "6",
                  "modelCustomizationName": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
                  "properties": {
                    "minCountInstances": 0,
                    "maxCountInstances": null,
                    "initialCount": 0,
                    "vfModuleLabel": "ADIOD_vRE_BV",
                    "baseModule": false
                  },
                  "inputs": {},
                  "volumeGroupAllowed": true
                },
                "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_base_vPE_BV..module-0": {
                  "uuid": "f8360508-3f17-4414-a2ed-6bc71161e8db",
                  "invariantUuid": "b34833bb-6aa9-4ad6-a831-70b06367a091",
                  "customizationUuid": "a55961b2-2065-4ab0-a5b7-2fcee1c227e3",
                  "description": null,
                  "name": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0",
                  "version": "5",
                  "modelCustomizationName": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0",
                  "properties": {
                    "minCountInstances": 1,
                    "maxCountInstances": 1,
                    "initialCount": 1,
                    "vfModuleLabel": "ADIOD_base_vPE_BV",
                    "baseModule": true
                  },
                  "inputs": {},
                  "volumeGroupAllowed": false
                },
                "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vPFE_BV..module-2": {
                  "uuid": "0a0dd9d4-31d3-4c3a-ae89-a02f383e6a9a",
                  "invariantUuid": "eff8cc59-53a1-4101-aed7-8cf24ecf8339",
                  "customizationUuid": "3cd946bb-50e0-40d8-96d3-c9023520b557",
                  "description": null,
                  "name": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
                  "version": "6",
                  "modelCustomizationName": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
                  "properties": {
                    "minCountInstances": 0,
                    "maxCountInstances": null,
                    "initialCount": 0,
                    "vfModuleLabel": "ADIOD_vPFE_BV",
                    "baseModule": false
                  },
                  "inputs": {},
                  "volumeGroupAllowed": true
                }
              },
              "volumeGroups": {
                "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vRE_BV..module-1": {
                  "uuid": "25284168-24bb-4698-8cb4-3f509146eca5",
                  "invariantUuid": "7253ff5c-97f0-4b8b-937c-77aeb4d79aa1",
                  "customizationUuid": "f7e7c365-60cf-49a9-9ebf-a1aa11b9d401",
                  "description": null,
                  "name": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
                  "version": "6",
                  "modelCustomizationName": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
                  "properties": {
                    "minCountInstances": 0,
                    "maxCountInstances": null,
                    "initialCount": 0,
                    "vfModuleLabel": "ADIOD_vRE_BV",
                    "baseModule": false
                  },
                  "inputs": {}
                },
                "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vPFE_BV..module-2": {
                  "uuid": "0a0dd9d4-31d3-4c3a-ae89-a02f383e6a9a",
                  "invariantUuid": "eff8cc59-53a1-4101-aed7-8cf24ecf8339",
                  "customizationUuid": "3cd946bb-50e0-40d8-96d3-c9023520b557",
                  "description": null,
                  "name": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
                  "version": "6",
                  "modelCustomizationName": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
                  "properties": {
                    "minCountInstances": 0,
                    "maxCountInstances": null,
                    "initialCount": 0,
                    "vfModuleLabel": "ADIOD_vPFE_BV",
                    "baseModule": false
                  },
                  "inputs": {}
                }
              },
              "vfcInstanceGroups": {}
            }
          },
          "networks": {
            "ExtVL 0": {
              "uuid": "ddc3f20c-08b5-40fd-af72-c6d14636b986",
              "invariantUuid": "379f816b-a7aa-422f-be30-17114ff50b7c",
              "description": "ECOMP generic virtual link (network) base type for all other service-level and global networks",
              "name": "ExtVL",
              "version": "37.0",
              "customizationUuid": "94fdd893-4a36-4d70-b16a-ec29c54c184f",
              "inputs": {},
              "commands": {},
              "properties": {
                "network_assignments": "{is_external_network=false, ipv4_subnet_default_assignment={min_subnets_count=1}, ecomp_generated_network_assignment=false, ipv6_subnet_default_assignment={min_subnets_count=1}}",
                "exVL_naming": "{ecomp_generated_naming=true}",
                "network_flows": "{is_network_policy=false, is_bound_to_vpn=false}",
                "network_homing": "{ecomp_selected_instance_node_target=false}"
              },
              "type": "VL",
              "modelCustomizationName": "ExtVL 0"
            }
          },
          "collectionResource": {},
          "configurations": {},
          "fabricConfigurations": {},
          "serviceProxies": {},
          "vfModules": {
            "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vRE_BV..module-1": {
              "uuid": "25284168-24bb-4698-8cb4-3f509146eca5",
              "invariantUuid": "7253ff5c-97f0-4b8b-937c-77aeb4d79aa1",
              "customizationUuid": "f7e7c365-60cf-49a9-9ebf-a1aa11b9d401",
              "description": null,
              "name": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
              "version": "6",
              "modelCustomizationName": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
              "properties": {
                "minCountInstances": 0,
                "maxCountInstances": null,
                "initialCount": 0,
                "vfModuleLabel": "ADIOD_vRE_BV",
                "baseModule": false
              },
              "inputs": {},
              "volumeGroupAllowed": true
            },
            "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_base_vPE_BV..module-0": {
              "uuid": "f8360508-3f17-4414-a2ed-6bc71161e8db",
              "invariantUuid": "b34833bb-6aa9-4ad6-a831-70b06367a091",
              "customizationUuid": "a55961b2-2065-4ab0-a5b7-2fcee1c227e3",
              "description": null,
              "name": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0",
              "version": "5",
              "modelCustomizationName": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0",
              "properties": {
                "minCountInstances": 1,
                "maxCountInstances": 1,
                "initialCount": 1,
                "vfModuleLabel": "ADIOD_base_vPE_BV",
                "baseModule": true
              },
              "inputs": {},
              "volumeGroupAllowed": false
            },
            "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vPFE_BV..module-2": {
              "uuid": "0a0dd9d4-31d3-4c3a-ae89-a02f383e6a9a",
              "invariantUuid": "eff8cc59-53a1-4101-aed7-8cf24ecf8339",
              "customizationUuid": "3cd946bb-50e0-40d8-96d3-c9023520b557",
              "description": null,
              "name": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
              "version": "6",
              "modelCustomizationName": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
              "properties": {
                "minCountInstances": 0,
                "maxCountInstances": null,
                "initialCount": 0,
                "vfModuleLabel": "ADIOD_vPFE_BV",
                "baseModule": false
              },
              "inputs": {},
              "volumeGroupAllowed": true
            }
          },
          "volumeGroups": {
            "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vRE_BV..module-1": {
              "uuid": "25284168-24bb-4698-8cb4-3f509146eca5",
              "invariantUuid": "7253ff5c-97f0-4b8b-937c-77aeb4d79aa1",
              "customizationUuid": "f7e7c365-60cf-49a9-9ebf-a1aa11b9d401",
              "description": null,
              "name": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
              "version": "6",
              "modelCustomizationName": "2017488AdiodVpe..ADIOD_vRE_BV..module-1",
              "properties": {
                "minCountInstances": 0,
                "maxCountInstances": null,
                "initialCount": 0,
                "vfModuleLabel": "ADIOD_vRE_BV",
                "baseModule": false
              },
              "inputs": {}
            },
            "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_vPFE_BV..module-2": {
              "uuid": "0a0dd9d4-31d3-4c3a-ae89-a02f383e6a9a",
              "invariantUuid": "eff8cc59-53a1-4101-aed7-8cf24ecf8339",
              "customizationUuid": "3cd946bb-50e0-40d8-96d3-c9023520b557",
              "description": null,
              "name": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
              "version": "6",
              "modelCustomizationName": "2017488AdiodVpe..ADIOD_vPFE_BV..module-2",
              "properties": {
                "minCountInstances": 0,
                "maxCountInstances": null,
                "initialCount": 0,
                "vfModuleLabel": "ADIOD_vPFE_BV",
                "baseModule": false
              },
              "inputs": {}
            }
          },
          "pnfs": {},
          "vnfGroups": {
            "groupingservicefortest..ResourceInstanceGroup..0": {
              "type": "VnfGroup",
              "invariantUuid": "4bb2e27e-ddab-4790-9c6d-1f731bc14a45",
              "uuid": "daeb6568-cef8-417f-9075-ed259ce59f48",
              "version": "1",
              "name": "groupingservicefortest..ResourceInstanceGroup..0",
              "modelCustomizationName": "groupingservicefortest..ResourceInstanceGroup..0",
              "properties": {
                "contained_resource_type": "VF",
                "role": "SERVICE-ACCESS",
                "function": "DATA",
                "description": "DDD0",
                "type": "LOAD-GROUP",
                "ecomp_generated_naming": "true"
              },
              "members": {
                "vdbe_svc_vprs_proxy 0": {
                  "uuid": "65fadfa8-a0d9-443f-95ad-836cd044e26c",
                  "invariantUuid": "f4baae0c-b3a5-4ca1-a777-afbffe7010bc",
                  "description": "A Proxy for Service vDBE_Svc_vPRS",
                  "name": "vDBE_Svc_vPRS Service Proxy",
                  "version": "1.0",
                  "customizationUuid": "bdb63d23-e132-4ce7-af2c-a493b4cafac9",
                  "inputs": {},
                  "commands": {},
                  "properties": {},
                  "type": "Service Proxy",
                  "sourceModelUuid": "da7827a2-366d-4be6-8c68-a69153c61274",
                  "sourceModelInvariant": "24632e6b-584b-4f45-80d4-fefd75fd9f14",
                  "sourceModelName": "vDBE_Svc_vPRS"
                }
              }
            },
            "groupingservicefortest..ResourceInstanceGroup..1": {
              "type": "VnfGroup",
              "invariantUuid": "a704112d-dbc6-4e56-8d4e-aec57e95ef9a",
              "uuid": "c2b300e6-45de-4e5e-abda-3032bee2de56",
              "version": "1",
              "name": "groupingservicefortest..ResourceInstanceGroup..1",
              "modelCustomizationName": "groupingservicefortest..ResourceInstanceGroup..1",
              "properties": {
                "contained_resource_type": "VF",
                "role": "SERVICE-ACCESS",
                "function": "SIGNALING",
                "description": "DDD1",
                "type": "LOAD-GROUP",
                "ecomp_generated_naming": "true"
              },
              "members": {
                "tsbc0001vm001_svc_proxy 0": {
                  "uuid": "65fadfa8-a0d9-443f-95ad-836cd044e26c",
                  "invariantUuid": "f4baae0c-b3a5-4ca1-a777-afbffe7010bc",
                  "description": "A Proxy for Service tsbc0001vm001_Svc",
                  "name": "tsbc0001vm001_Svc Service Proxy",
                  "version": "1.0",
                  "customizationUuid": "3d814462-30fb-4c62-b997-9aa360d27ead",
                  "inputs": {},
                  "commands": {},
                  "properties": {},
                  "type": "Service Proxy",
                  "sourceModelUuid": "28aeb8f6-5620-4148-8bfb-a5fb406f0309",
                  "sourceModelInvariant": "c989ab9a-33c7-46ec-b521-1b2daef5f047",
                  "sourceModelName": "tsbc0001vm001_Svc"
                }
              }
            }
          }
        },
        "b75e0d22-05ff-4448-9266-5f0d4e1dbbd6": {
          "service": {
            "uuid": "b75e0d22-05ff-4448-9266-5f0d4e1dbbd6",
            "invariantUuid": "5b9c0f33-eec1-484a-bf77-736a6644d7a8",
            "name": "Using VID for VoIP Network Instantiations Shani",
            "version": "1.0",
            "toscaModelURL": null,
            "category": "VoIP Call Control",
            "serviceType": "",
            "serviceRole": "",
            "description": "Using VID for VoIP Network Instantiations Shani",
            "serviceEcompNaming": "true",
            "instantiationType": "ClientConfig",
            "inputs": {},
            "vidNotions": {"instantiationUI": "legacy", "modelCategory": "other", "viewEditUI": "legacy"}
          },
          "vnfs": {},
          "networks": {
            "AIC30_CONTRAIL_BASIC 0": {
              "uuid": "ac815c68-35b7-4ea4-9d04-92d2f844b27c",
              "invariantUuid": "de01afb5-532b-451d-aac4-ff9ff0644060",
              "description": "Basic contrail 3.0.x L3 network for AIC 3.x sites. ",
              "name": "AIC30_CONTRAIL_BASIC",
              "version": "3.0",
              "customizationUuid": "e94d61f7-b4b2-489a-a4a7-30b1a1a80daf",
              "inputs": {},
              "commands": {},
              "properties": {
                "network_assignments": "{is_external_network=false, ipv4_subnet_default_assignment={min_subnets_count=1}, ecomp_generated_network_assignment=false, ipv6_subnet_default_assignment={min_subnets_count=1}}",
                "exVL_naming": "{ecomp_generated_naming=true}",
                "network_flows": "{is_network_policy=false, is_bound_to_vpn=false}",
                "network_scope": "Service",
                "network_type": "AIC30_CONTRAIL_BASIC",
                "network_technology": "Contrail",
                "network_homing": "{ecomp_selected_instance_node_target=false}"
              },
              "type": "VL",
              "modelCustomizationName": "AIC30_CONTRAIL_BASIC 0"
            }
          },
          "collectionResource": {},
          "configurations": {},
          "fabricConfigurations": {},
          "serviceProxies": {},
          "vfModules": {},
          "volumeGroups": {},
          "pnfs": {},
          "vnfGroups": {}
        }
      },
      "serviceInstance": {
        "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd": {
          "vnfs": {
            "2017-488_ADIOD-vPE 0": {
              "action": "None",
              "inMaint": false,
              "rollbackOnFailure": "true",
              "originalName": "2017-488_ADIOD-vPE 0",
              "isMissingData": false,
              "trackById": "stigekyxrqi",
              "vfModules": {
                "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_base_vPE_BV..module-0": {
                  "2017488_adiodvpe0..2017488AdiodVpe..ADIOD_base_vPE_BV..module-0gytfi": {
                    "isMissingData": false,
                    "sdncPreReload": null,
                    "modelInfo": {
                      "modelType": "VFmodule",
                      "modelInvariantId": "b34833bb-6aa9-4ad6-a831-70b06367a091",
                      "modelVersionId": "f8360508-3f17-4414-a2ed-6bc71161e8db",
                      "modelName": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0",
                      "modelVersion": "5",
                      "modelCustomizationId": "a55961b2-2065-4ab0-a5b7-2fcee1c227e3",
                      "modelCustomizationName": "2017488AdiodVpe..ADIOD_base_vPE_BV..module-0"
                    },
                    "instanceParams": [{}],
                    "trackById": "3oj23o7nupo"
                  }
                }
              },
              "vnfStoreKey": "2017-488_ADIOD-vPE 0",
              "uuid": "69e09f68-8b63-4cc9-b9ff-860960b5db09",
              "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
              "lcpCloudRegionId": "JANET25",
              "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
              "lineOfBusiness": "ONAP",
              "platformName": "xxx1",
              "modelInfo": {
                "modelInvariantId": "72e465fe-71b1-4e7b-b5ed-9496118ff7a8",
                "modelVersionId": "69e09f68-8b63-4cc9-b9ff-860960b5db09",
                "modelName": "2017-488_ADIOD-vPE",
                "modelVersion": "5.0",
                "modelCustomizationName": "2017-488_ADIOD-vPE 0",
                "modelCustomizationId": "1da7b585-5e61-4993-b95e-8e6606c81e45",
                "uuid": "69e09f68-8b63-4cc9-b9ff-860960b5db09"
              },
              "legacyRegion": "11111111",
              "instanceParams": [{}]
            },
            "2017-388_ADIOD-vPE 0": {
              "action": "Create",
              "inMaint": false,
              "rollbackOnFailure": "true",
              "originalName": "2017-388_ADIOD-vPE 0",
              "isMissingData": false,
              "trackById": "nib719t5vca",
              "vfModules": {},
              "vnfStoreKey": "2017-388_ADIOD-vPE 0",
              "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
              "lcpCloudRegionId": "JANET25",
              "legacyRegion": "11111",
              "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
              "platformName": "platform",
              "lineOfBusiness": "zzz1",
              "instanceParams": [{}],
              "modelInfo": {
                "modelInvariantId": "72e465fe-71b1-4e7b-b5ed-9496118ff7a8",
                "modelVersionId": "afacccf6-397d-45d6-b5ae-94c39734b168",
                "modelName": "2017-388_ADIOD-vPE",
                "modelVersion": "4.0",
                "modelCustomizationId": "b3c76f73-eeb5-4fb6-9d31-72a889f1811c",
                "modelCustomizationName": "2017-388_ADIOD-vPE 0",
                "uuid": "afacccf6-397d-45d6-b5ae-94c39734b168"
              },
              "uuid": "afacccf6-397d-45d6-b5ae-94c39734b168"
            },
            "2017-388_ADIOD-vPE 1": {
              "action": "None",
              "inMaint": false,
              "rollbackOnFailure": "true",
              "originalName": "2017-388_ADIOD-vPE 1",
              "isMissingData": false,
              "trackById": "cv7l1ak8vpe",
              "vfModules": {},
              "vnfStoreKey": "2017-388_ADIOD-vPE 1",
              "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
              "lcpCloudRegionId": "JANET25",
              "legacyRegion": "123",
              "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
              "platformName": "platform",
              "lineOfBusiness": "ONAP",
              "instanceParams": [{}],
              "modelInfo": {
                "modelInvariantId": "00beb8f9-6d39-452f-816d-c709b9cbb87d",
                "modelVersionId": "0903e1c0-8e03-4936-b5c2-260653b96413",
                "modelName": "2017-388_ADIOD-vPE",
                "modelVersion": "1.0",
                "modelCustomizationId": "280dec31-f16d-488b-9668-4aae55d6648a",
                "modelCustomizationName": "2017-388_ADIOD-vPE 1",
                "uuid": "0903e1c0-8e03-4936-b5c2-260653b96413"
              },
              "uuid": "0903e1c0-8e03-4936-b5c2-260653b96413"
            }
          },
          "instanceParams": [{}],
          "validationCounter": 0,
          "existingNames": {"yoav": ""},
          "existingVNFCounterMap": {
            "69e09f68-8b63-4cc9-b9ff-860960b5db09": 1,
            "afacccf6-397d-45d6-b5ae-94c39734b168": 1,
            "0903e1c0-8e03-4936-b5c2-260653b96413": 1
          },
          "existingVnfGroupCounterMap": {
            "daeb6568-cef8-417f-9075-ed259ce59f48": 0,
            "c2b300e6-45de-4e5e-abda-3032bee2de56": -1
          },
          "existingNetworksCounterMap": {"ddc3f20c-08b5-40fd-af72-c6d14636b986": 1},
          "networks": {
            "ExtVL 0": {
              "inMaint": false,
              "rollbackOnFailure": "true",
              "originalName": "ExtVL 0",
              "isMissingData": false,
              "trackById": "s6okajvv2n8",
              "networkStoreKey": "ExtVL 0",
              "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
              "lcpCloudRegionId": "JANET25",
              "legacyRegion": "12355555",
              "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
              "platformName": "platform",
              "lineOfBusiness": null,
              "instanceParams": [{}],
              "modelInfo": {
                "modelInvariantId": "379f816b-a7aa-422f-be30-17114ff50b7c",
                "modelVersionId": "ddc3f20c-08b5-40fd-af72-c6d14636b986",
                "modelName": "ExtVL",
                "modelVersion": "37.0",
                "modelCustomizationId": "94fdd893-4a36-4d70-b16a-ec29c54c184f",
                "modelCustomizationName": "ExtVL 0",
                "uuid": "ddc3f20c-08b5-40fd-af72-c6d14636b986"
              },
              "uuid": "ddc3f20c-08b5-40fd-af72-c6d14636b986"
            }
          },
          "vnfGroups": {
            "groupingservicefortest..ResourceInstanceGroup..0": {
              "inMaint": false,
              "rollbackOnFailure": "true",
              "originalName": "groupingservicefortest..ResourceInstanceGroup..0",
              "isMissingData": false,
              "trackById": "se0obn93qq",
              "vnfGroupStoreKey": "groupingservicefortest..ResourceInstanceGroup..0",
              "instanceName": "groupingservicefortestResourceInstanceGroup0",
              "instanceParams": [{}],
              "modelInfo": {
                "modelInvariantId": "4bb2e27e-ddab-4790-9c6d-1f731bc14a45",
                "modelVersionId": "daeb6568-cef8-417f-9075-ed259ce59f48",
                "modelName": "groupingservicefortest..ResourceInstanceGroup..0",
                "modelVersion": "1",
                "modelCustomizationName": "groupingservicefortest..ResourceInstanceGroup..0",
                "uuid": "daeb6568-cef8-417f-9075-ed259ce59f48"
              },
              "uuid": "daeb6568-cef8-417f-9075-ed259ce59f48"
            }
          },
          "instanceName": "yoav",
          "globalSubscriberId": "e433710f-9217-458d-a79d-1c7aff376d89",
          "subscriptionServiceType": "TYLER SILVIA",
          "owningEntityId": "d61e6f2d-12fa-4cc2-91df-7c244011d6fc",
          "productFamilyId": "d8a6ed93-251c-47ca-adc9-86671fd19f4c",
          "lcpCloudRegionId": "JANET25",
          "tenantId": "092eb9e8e4b7412e8787dd091bc58e86",
          "aicZoneId": "ATL53",
          "pause": null,
          "projectName": "WATKINS",
          "rollbackOnFailure": "true",
          "bulkSize": 1,
          "aicZoneName": "AAIATLTE-ATL53",
          "owningEntityName": "WayneHolland",
          "testApi": "VNF_API",
          "isEcompGeneratedNaming": false,
          "tenantName": "USP-SIP-IC-24335-T-01",
          "modelInfo": {
            "modelInvariantId": "cdb90b57-ed78-4d44-a5b4-7f43a02ec632",
            "modelVersionId": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd",
            "modelName": "action-data",
            "modelVersion": "1.0",
            "uuid": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd"
          },
          "isALaCarte": false,
          "name": "action-data",
          "version": "1.0",
          "description": "ADIOD vMX vPE based on Juniper 17.2 release. Updated with updated VF for v8.0 of VLM",
          "category": "Network L1-3",
          "uuid": "1a80c596-27e5-4ca9-b5bb-e03a7fd4c0fd",
          "invariantUuid": "cdb90b57-ed78-4d44-a5b4-7f43a02ec632",
          "serviceType": "pnf",
          "serviceRole": "Testing",
          "vidNotions": {"instantiationUI": "legacy", "modelCategory": "other", "viewEditUI": "legacy"},
          "isMultiStepDesign": true
        }
      },
      "lcpRegionsAndTenants": {
        "lcpRegionList": [{
          "id": "JANET25",
          "name": "JANET25 (AIC)",
          "isPermitted": true,
          "cloudOwner": "irma-aic"
        }, {"id": "hvf6", "name": "hvf6 (AIC)", "isPermitted": true, "cloudOwner": "irma-aic"}],
        "lcpRegionsTenantsMap": {
          "JANET25": [{
            "id": "092eb9e8e4b7412e8787dd091bc58e86",
            "name": "USP-SIP-IC-24335-T-01",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }],
          "hvf6": [{
            "id": "bae71557c5bb4d5aac6743a4e5f1d054",
            "name": "AIN Web Tool-15-D-testalexandria",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "229bcdc6eaeb4ca59d55221141d01f8e",
            "name": "AIN Web Tool-15-D-STTest2",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "1178612d2b394be4834ad77f567c0af2",
            "name": "AIN Web Tool-15-D-SSPtestcustome",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "19c5ade915eb461e8af52fb2fd8cd1f2",
            "name": "AIN Web Tool-15-D-UncheckedEcopm",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "de007636e25249238447264a988a927b",
            "name": "AIN Web Tool-15-D-dfsdf",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "62f29b3613634ca6a3065cbe0e020c44",
            "name": "AIN/SMS-16-D-Multiservices1",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "649289e30d3244e0b48098114d63c2aa",
            "name": "AIN Web Tool-15-D-SSPST66",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "3f21eeea6c2c486bba31dab816c05a32",
            "name": "AIN Web Tool-15-D-ASSPST47",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "f60ce21d3ee6427586cff0d22b03b773",
            "name": "CESAR-100-D-sspjg67246",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "8774659e425f479895ae091bb5d46560",
            "name": "CESAR-100-D-sspjg68359",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "624eb554b0d147c19ff8885341760481",
            "name": "AINWebTool-15-D-iftach",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "214f55f5fc414c678059c383b03e4962",
            "name": "CESAR-100-D-sspjg612401",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "c90666c291664841bb98e4d981ff1db5",
            "name": "CESAR-100-D-sspjg621340",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "ce5b6bc5c7b348e1bf4b91ac9a174278",
            "name": "sspjg621351cloned",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "b386b768a3f24c8e953abbe0b3488c02",
            "name": "AINWebTool-15-D-eteancomp",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "dc6c4dbfd225474e9deaadd34968646c",
            "name": "AINWebTool-15-T-SPFET",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "02cb5030e9914aa4be120bd9ed1e19eb",
            "name": "AINWebTool-15-X-eeweww",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "f2f3830e4c984d45bcd00e1a04158a79",
            "name": "CESAR-100-D-spjg61909",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "05b91bd5137f4929878edd965755c06d",
            "name": "CESAR-100-D-sspjg621512cloned",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "7002fbe8482d4a989ddf445b1ce336e0",
            "name": "AINWebTool-15-X-vdr",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "4008522be43741dcb1f5422022a2aa0b",
            "name": "AINWebTool-15-D-ssasa",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "f44e2e96a1b6476abfda2fa407b00169",
            "name": "AINWebTool-15-D-PFNPT",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "b69a52bec8a84669a37a1e8b72708be7",
            "name": "AINWebTool-15-X-vdre",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "fac7d9fd56154caeb9332202dcf2969f",
            "name": "AINWebTool-15-X-NONPODECOMP",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "2d34d8396e194eb49969fd61ffbff961",
            "name": "DN5242-Nov16-T5",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "cb42a77ff45b48a8b8deb83bb64acc74",
            "name": "ro-T11",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "fa45ca53c80b492fa8be5477cd84fc2b",
            "name": "ro-T112",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "4914ab0ab3a743e58f0eefdacc1dde77",
            "name": "DN5242-Nov21-T1",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "d0a3e3f2964542259d155a81c41aadc3",
            "name": "test-hvf6-09",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }, {
            "id": "cbb99fe4ada84631b7baf046b6fd2044",
            "name": "DN5242-Nov16-T3",
            "isPermitted": true,
            "cloudOwner": "irma-aic"
          }]
        }
      },
      "subscribers": [{
        "id": "ERICA5779-Subscriber-2",
        "name": "ERICA5779-Subscriber-2",
        "isPermitted": false
      }, {
        "id": "ERICA5779-Subscriber-3",
        "name": "ERICA5779-Subscriber-3",
        "isPermitted": false
      }, {
        "id": "ERICA5779-Subscriber-4",
        "name": "ERICA5779-Subscriber-5",
        "isPermitted": false
      }, {
        "id": "ERICA5779-TestSub-PWT-101",
        "name": "ERICA5779-TestSub-PWT-101",
        "isPermitted": false
      }, {
        "id": "ERICA5779-TestSub-PWT-102",
        "name": "ERICA5779-TestSub-PWT-102",
        "isPermitted": false
      }, {
        "id": "ERICA5779-TestSub-PWT-103",
        "name": "ERICA5779-TestSub-PWT-103",
        "isPermitted": false
      }, {
        "id": "31739f3e-526b-11e6-beb8-9e71128cae77",
        "name": "CRAIG/ROBERTS",
        "isPermitted": false
      }, {"id": "DHV1707-TestSubscriber-2", "name": "DALE BRIDGES", "isPermitted": false}, {
        "id": "jimmy-example",
        "name": "JimmyExampleCust-20161102",
        "isPermitted": false
      }, {"id": "jimmy-example2", "name": "JimmyExampleCust-20161103", "isPermitted": false}, {
        "id": "CAR_2020_ER",
        "name": "CAR_2020_ER",
        "isPermitted": true
      }, {
        "id": "a9a77d5a-123e-4ca2-9eb9-0b015d2ee0fb",
        "name": "Emanuel",
        "isPermitted": false
      }, {
        "id": "21014aa2-526b-11e6-beb8-9e71128cae77",
        "name": "JULIO ERICKSON",
        "isPermitted": false
      }, {
        "id": "DHV1707-TestSubscriber-1",
        "name": "LLOYD BRIDGES",
        "isPermitted": false
      }, {"id": "e433710f-9217-458d-a79d-1c7aff376d89", "name": "SILVIA ROBBINS", "isPermitted": true}],
      "productFamilies": null,
      "serviceTypes": {
        "e433710f-9217-458d-a79d-1c7aff376d89": [{
          "id": "17",
          "name": "JOHANNA_SANTOS",
          "isPermitted": false
        }, {"id": "16", "name": "LINDSEY", "isPermitted": false}, {
          "id": "2",
          "name": "Emanuel",
          "isPermitted": false
        }, {"id": "5", "name": "Kennedy", "isPermitted": false}, {
          "id": "14",
          "name": "SSD",
          "isPermitted": false
        }, {"id": "1", "name": "TYLER SILVIA", "isPermitted": true}, {
          "id": "12",
          "name": "VPMS",
          "isPermitted": false
        }, {"id": "3", "name": "vJamie", "isPermitted": false}, {
          "id": "0",
          "name": "vRichardson",
          "isPermitted": false
        }, {"id": "18", "name": "vCarroll", "isPermitted": false}, {
          "id": "9",
          "name": "vMME",
          "isPermitted": false
        }, {"id": "13", "name": "vMMSC", "isPermitted": false}, {
          "id": "10",
          "name": "vMNS",
          "isPermitted": false
        }, {"id": "15", "name": "vMOG", "isPermitted": false}, {
          "id": "8",
          "name": "vOTA",
          "isPermitted": false
        }, {"id": "11", "name": "vSCP", "isPermitted": false}, {
          "id": "6",
          "name": "vSEGW",
          "isPermitted": false
        }, {"id": "7", "name": "vVM", "isPermitted": false}, {"id": "4", "name": "vVoiceMail", "isPermitted": false}]
      },
      "aicZones": [{"id": "ATL53", "name": "AAIATLTE-ATL53"}, {"id": "ABC15", "name": "AAITESAN-ABC15"}, {
        "id": "TES36",
        "name": "ABCEETES-TES36"
      }, {"id": "ATL54", "name": "AICFTAAI-ATL54"}, {"id": "ATL43", "name": "AICLOCID-ATL43"}, {
        "id": "AMD15",
        "name": "AMDFAA01-AMD15"
      }, {"id": "AMF11", "name": "AMDOCS01-AMF11"}, {"id": "RCT1", "name": "AMSTERNL-RCT1"}, {
        "id": "AMS1",
        "name": "AMSTNLBW-AMS1"
      }, {"id": "HJH1", "name": "AOEEQQQD-HJH1"}, {"id": "HJE1", "name": "AOEEWWWD-HJE1"}, {
        "id": "MCS1",
        "name": "ASACMAMS-MCS1"
      }, {"id": "AUG1", "name": "ASDFGHJK-AUG1"}, {"id": "LUC1", "name": "ATLDFGYC-LUC1"}, {
        "id": "ATL1",
        "name": "ATLNGAMA-ATL1"
      }, {"id": "ATL2", "name": "ATLNGANW-ATL2"}, {"id": "HPO1", "name": "ATLNGAUP-HPO1"}, {
        "id": "ANI1",
        "name": "ATLNGTRE-ANI1"
      }, {"id": "ATL44", "name": "ATLSANAB-ATL44"}, {"id": "ATL56", "name": "ATLSANAC-ATL56"}, {
        "id": "ABC11",
        "name": "ATLSANAI-ABC11"
      }, {"id": "ATL34", "name": "ATLSANAI-ATL34"}, {"id": "ATL63", "name": "ATLSANEW-ATL63"}, {
        "id": "ABC12",
        "name": "ATLSECIA-ABC12"
      }, {"id": "AMD18", "name": "AUDIMA01-AMD18"}, {"id": "AVT1", "name": "AVTRFLHD-AVT1"}, {
        "id": "KIT1",
        "name": "BHYJFGLN-KIT1"
      }, {"id": "BHY17", "name": "BHYTFRF3-BHY17"}, {"id": "RTW5", "name": "BHYTFRY4-RTW5"}, {
        "id": "RTZ4",
        "name": "BHYTFRZ6-RTZ4"
      }, {"id": "RTD2", "name": "BHYTFRk4-RTD2"}, {"id": "BNA1", "name": "BNARAGBK-BNA1"}, {
        "id": "VEL1",
        "name": "BNMLKUIK-VEL1"
      }, {"id": "BOT1", "name": "BOTHWAKY-BOT1"}, {"id": "CAL33", "name": "CALIFORN-CAL33"}, {
        "id": "ATL84",
        "name": "CANTTCOC-ATL84"
      }, {"id": "HSD1", "name": "CHASKCDS-HSD1"}, {"id": "CHI1", "name": "CHILLIWE-CHI1"}, {
        "id": "XCP12",
        "name": "CHKGH123-XCP12"
      }, {"id": "JNL1", "name": "CJALSDAC-JNL1"}, {"id": "KJN1", "name": "CKALDKSA-KJN1"}, {
        "id": "CLG1",
        "name": "CLGRABAD-CLG1"
      }, {"id": "CKL1", "name": "CLKSKCKK-CKL1"}, {"id": "ATL66", "name": "CLLIAAII-ATL66"}, {
        "id": "CQK1",
        "name": "CQKSCAKK-CQK1"
      }, {"id": "CWY1", "name": "CWYMOWBS-CWY1"}, {"id": "DKJ1", "name": "DKJSJDKA-DKJ1"}, {
        "id": "DSF45",
        "name": "DSFBG123-DSF45"
      }, {"id": "DSL12", "name": "DSLFK242-DSL12"}, {"id": "FDE55", "name": "FDERT555-FDE55"}, {
        "id": "VEN2",
        "name": "FGHJUHIL-VEN2"
      }, {"id": "ATL64", "name": "FORLOAAJ-ATL64"}, {"id": "GNV1", "name": "GNVLSCTL-GNV1"}, {
        "id": "SAN22",
        "name": "GNVLSCTL-SAN22"
      }, {"id": "KAP1", "name": "HIOUYTRQ-KAP1"}, {"id": "LIS1", "name": "HOSTPROF-LIS1"}, {
        "id": "HRG1",
        "name": "HRGHRGGS-HRG1"
      }, {"id": "HST25", "name": "HSTNTX01-HST25"}, {"id": "STN27", "name": "HSTNTX01-STN27"}, {
        "id": "HST70",
        "name": "HSTNTX70-HST70"
      }, {"id": "KOR1", "name": "HYFLNBVT-KOR1"}, {"id": "RAD10", "name": "INDIPUNE-RAD10"}, {
        "id": "REL1",
        "name": "INGERFGT-REL1"
      }, {"id": "JAD1", "name": "JADECLLI-JAD1"}, {"id": "HKA1", "name": "JAKHLASS-HKA1"}, {
        "id": "JCS1",
        "name": "JCSJSCJS-JCS1"
      }, {"id": "JCV1", "name": "JCVLFLBW-JCV1"}, {"id": "KGM2", "name": "KGMTNC20-KGM2"}, {
        "id": "KJF12",
        "name": "KJFDH123-KJF12"
      }, {"id": "JGS1", "name": "KSJKKKKK-JGS1"}, {"id": "LAG1", "name": "LARGIZON-LAG1"}, {
        "id": "LAG1a",
        "name": "LARGIZON-LAG1a"
      }, {"id": "LAG45", "name": "LARGIZON-LAG1a"}, {"id": "LAG1b", "name": "LARGIZON-LAG1b"}, {
        "id": "WAN1",
        "name": "LEIWANGW-WAN1"
      }, {"id": "DSA1", "name": "LKJHGFDS-DSA1"}, {"id": "LON1", "name": "LONEENCO-LON1"}, {
        "id": "SITE",
        "name": "LONEENCO-SITE"
      }, {"id": "ZXL1", "name": "LWLWCANN-ZXL1"}, {"id": "MTN20", "name": "MDTWNJ21-MTN20"}, {
        "id": "MTN32",
        "name": "MDTWNJ21-MTN32"
      }, {"id": "AMD13", "name": "MEMATLAN-AMD13"}, {"id": "MIC54", "name": "MICHIGAN-MIC54"}, {
        "id": "MAR1",
        "name": "MNBVCXZM-MAR1"
      }, {"id": "NCA1", "name": "NCANCANN-NCA1"}, {"id": "NFT1", "name": "NFTJSSSS-NFT1"}, {
        "id": "GAR1",
        "name": "NGFVSJKO-GAR1"
      }, {"id": "NYC1", "name": "NYCMNY54-NYC1"}, {"id": "OKC1", "name": "OKCBOK55-OKC1"}, {
        "id": "OLG1",
        "name": "OLHOLHOL-OLG1"
      }, {"id": "OLK1", "name": "OLKOLKLS-OLK1"}, {"id": "NIR1", "name": "ORFLMANA-NIR1"}, {
        "id": "JAN1",
        "name": "ORFLMATT-JAN1"
      }, {"id": "ORL1", "name": "ORLDFLMA-ORL1"}, {"id": "PAR1", "name": "PARSFRCG-PAR1"}, {
        "id": "PBL1",
        "name": "PBLAPBAI-PBL1"
      }, {"id": "mac10", "name": "PKGTESTF-mac10"}, {"id": "mac20", "name": "PKGTESTF-mac20"}, {
        "id": "TIR2",
        "name": "PLKINHYI-TIR2"
      }, {"id": "IBB1", "name": "PLMKOIJU-IBB1"}, {"id": "COM1", "name": "PLMKOPIU-COM1"}, {
        "id": "POI1",
        "name": "PLMNJKIU-POI1"
      }, {"id": "PLT1", "name": "PLTNCA60-PLT1"}, {"id": "POI22", "name": "POIUY123-POI22"}, {
        "id": "DCC1",
        "name": "POIUYTGH-DCC1"
      }, {"id": "DCC1a", "name": "POIUYTGH-DCC1a"}, {"id": "DCC1b", "name": "POIUYTGH-DCC1b"}, {
        "id": "DCC2",
        "name": "POIUYTGH-DCC2"
      }, {"id": "DCC3", "name": "POIUYTGH-DCC3"}, {"id": "IAA1", "name": "QAZXSWED-IAA1"}, {
        "id": "QWE1",
        "name": "QWECLLI1-QWE1"
      }, {"id": "NUM1", "name": "QWERTYUI-NUM1"}, {"id": "RAD1", "name": "RADICAL1-RAD1"}, {
        "id": "RJN1",
        "name": "RJNRBZAW-RJN1"
      }, {"id": "SAA13", "name": "SAIT1AA9-SAA13"}, {"id": "SAA14", "name": "SAIT1AA9-SAA14"}, {
        "id": "SDD81",
        "name": "SAIT1DD6-SDD81"
      }, {"id": "SDD82", "name": "SAIT1DD9-SDD82"}, {"id": "SAA11", "name": "SAIT9AA2-SAA11"}, {
        "id": "SAA80",
        "name": "SAIT9AA3-SAA80"
      }, {"id": "SAA12", "name": "SAIT9AF8-SAA12"}, {"id": "SCC80", "name": "SAIT9CC3-SCC80"}, {
        "id": "ATL75",
        "name": "SANAAIRE-ATL75"
      }, {"id": "ICC1", "name": "SANJITAT-ICC1"}, {"id": "SCK1", "name": "SCKSCKSK-SCK1"}, {
        "id": "EHH78",
        "name": "SDCSHHH5-EHH78"
      }, {"id": "SAA78", "name": "SDCTAAA1-SAA78"}, {"id": "SAX78", "name": "SDCTAXG1-SAX78"}, {
        "id": "SBX78",
        "name": "SDCTBXG1-SBX78"
      }, {"id": "SEE78", "name": "SDCTEEE4-SEE78"}, {"id": "SGG78", "name": "SDCTGGG1-SGG78"}, {
        "id": "SXB78",
        "name": "SDCTGXB1-SXB78"
      }, {"id": "SJJ78", "name": "SDCTJJJ1-SJJ78"}, {"id": "SKK78", "name": "SDCTKKK1-SKK78"}, {
        "id": "SLF78",
        "name": "SDCTLFN1-SLF78"
      }, {"id": "SLL78", "name": "SDCTLLL1-SLL78"}, {"id": "MAD11", "name": "SDFQWGKL-MAD11"}, {
        "id": "HGD1",
        "name": "SDFQWHGD-HGD1"
      }, {"id": "SBB78", "name": "SDIT1BBB-SBB78"}, {"id": "SDG78", "name": "SDIT1BDG-SDG78"}, {
        "id": "SBU78",
        "name": "SDIT1BUB-SBU78"
      }, {"id": "SHH78", "name": "SDIT1HHH-SHH78"}, {"id": "SJU78", "name": "SDIT1JUB-SJU78"}, {
        "id": "SNA1",
        "name": "SNANTXCA-SNA1"
      }, {"id": "SAM1", "name": "SNDGCA64-SAN1"}, {"id": "SNG1", "name": "SNGPSIAU-SNG1"}, {
        "id": "SSA56",
        "name": "SSIT2AA7-SSA56"
      }, {"id": "STG1", "name": "STTGGE62-STG1"}, {"id": "STT1", "name": "STTLWA02-STT1"}, {
        "id": "SYD1",
        "name": "SYDNAUBV-SYD1"
      }, {"id": "ATL99", "name": "TEESTAAI-ATL43"}, {"id": "ATL98", "name": "TEESTAAI-ATL43"}, {
        "id": "ATL76",
        "name": "TELEPAAI-ATL76"
      }, {"id": "ABC14", "name": "TESAAISA-ABC14"}, {"id": "TAT33", "name": "TESAAISA-TAT33"}, {
        "id": "TAT34",
        "name": "TESAAISB-TAT34"
      }, {"id": "TAT37", "name": "TESAAISD-TAT37"}, {"id": "ATL62", "name": "TESSASCH-ATL62"}, {
        "id": "TLP1",
        "name": "TLPNXM18-TLP1"
      }, {"id": "SAN13", "name": "TOKYJPFA-SAN13"}, {"id": "TOK1", "name": "TOKYJPFA-TOK1"}, {
        "id": "TOL1",
        "name": "TOLDOH21-TOL1"
      }, {"id": "TOR1", "name": "TOROONXN-TOR1"}, {"id": "TOY1", "name": "TORYONNZ-TOY1"}, {
        "id": "ATL35",
        "name": "TTESSAAI-ATL35"
      }, {"id": "TUF1", "name": "TUFCLLI1-TUF1"}, {"id": "SAI1", "name": "UBEKQLPD-SAI1"}, {
        "id": "UUU4",
        "name": "UUUAAAUU-UUU4"
      }, {"id": "YYY1", "name": "UUUAIAAI-YYY1"}, {"id": "BAN1", "name": "VSDKYUTP-BAN1"}, {
        "id": "WAS1",
        "name": "WASHDCSW-WAS1"
      }, {"id": "APP1", "name": "WBHGTYUI-APP1"}, {"id": "SUL2", "name": "WERTYUJK-SUL2"}, {
        "id": "DEF2",
        "name": "WSBHGTYL-DEF2"
      }, {"id": "DHA12", "name": "WSXEDECF-DHA12"}, {"id": "MNT11", "name": "WSXEFBTH-MNT11"}, {
        "id": "RAJ1",
        "name": "YGBIJNLQ-RAJ1"
      }, {"id": "JAG1", "name": "YUDFJULP-JAG1"}, {"id": "ZEN1", "name": "ZENCLLI1-ZEN1"}, {
        "id": "ZOG1",
        "name": "ZOGASTRO-ZOG1"
      }, {"id": "SDE1", "name": "ZXCVBNMA-SDE1"}, {"id": "SIP1", "name": "ZXCVBNMK-SIP1"}, {
        "id": "JUL1",
        "name": "ZXCVBNMM-JUL1"
      }, {"id": "ERT1", "name": "ertclli1-ERT1"}, {"id": "IOP1", "name": "iopclli1-IOP1"}, {
        "id": "OPA1",
        "name": "opaclli1-OPA1"
      }, {"id": "RAI1", "name": "poiuytre-RAI1"}, {"id": "PUR1", "name": "purelyde-PUR1"}, {
        "id": "RTY1",
        "name": "rtyclli1-RTY1"
      }, {"id": "SDF1", "name": "sdfclli1-SDF1"}, {"id": "SSW56", "name": "ss8126GT-SSW56"}, {
        "id": "UIO1",
        "name": "uioclli1-UIO1"
      }],
      "categoryParameters": {
        "owningEntityList": [{
          "id": "aaa1",
          "name": "aaa1"
        }, {"id": "d61e6f2d-12fa-4cc2-91df-7c244011d6fc", "name": "WayneHolland"}, {
          "id": "Melissa",
          "name": "Melissa"
        }],
        "projectList": [{"id": "WATKINS", "name": "WATKINS"}, {"id": "x1", "name": "x1"}, {"id": "yyy1", "name": "yyy1"}],
        "lineOfBusinessList": [{"id": "ONAP", "name": "ONAP"}, {"id": "zzz1", "name": "zzz1"}],
        "platformList": [{"id": "platform", "name": "platform"}, {"id": "xxx1", "name": "xxx1"}]
      },
      "type": "UPDATE_LCP_REGIONS_AND_TENANTS"
    }
  }
}