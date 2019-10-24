///<reference path="../../../node_modules/cypress/types/index.d.ts"/> / <reference types="Cypress" />
import {JsonBuilder} from '../../support/jsonBuilders/jsonBuilder';
import {ServiceModel} from '../../support/jsonBuilders/models/service.model';
import {AaiServiceInstancesModel} from '../../support/jsonBuilders/models/serviceInstances.model';
import {AAISubViewEditModel} from '../../support/jsonBuilders/models/aaiSubViewEdit.model';

const jsonBuilderAndMock: JsonBuilder<ServiceModel> = new JsonBuilder<ServiceModel>();
const SUBSCRIBER_ID = "e433710f-9217-458d-a79d-1c7aff376d89";
const SERVICE_MODEL_ID: string = '6e59c5de-f052-46fa-aa7e-2fca9d674c44';

export const initServicePlanning = function (viewOrEdit: string, customModelFilePath?: string) {
  const SERVICE_TYPE: string = "TYLER SILVIA";
  const SERVICE_INSTANCE_ID: string = "f8791436-8d55-4fde-b4d5-72dd2cf13cfb";
  if (Cypress._.isNil(customModelFilePath)) {
    customModelFilePath = '../vid-automation/src/test/resources/aaiGetInstanceTopology/ServiceTreeWithMultipleChildren_serviceInstance.json';
  }

  cy.readFile('../vid-automation/src/test/resources/aaiGetInstanceTopology/ServiceTreeWithMultipleChildren_serviceModel.json').then((res) => {
    jsonBuilderAndMock.basicJson(
      res,
      Cypress.config('baseUrl') + "/rest/models/services/6e59c5de-f052-46fa-aa7e-2fca9d674c44",
      200,
      0,
      "ServiceTreeWithMultipleChildren_serviceModel",
    )
  });

  cy.readFile(customModelFilePath).then((res) => {
    jsonBuilderAndMock.basicJson(
      res,
      Cypress.config('baseUrl') + "/aai_get_service_instance_topology/e433710f-9217-458d-a79d-1c7aff376d89/TYLER SILVIA/f8791436-8d55-4fde-b4d5-72dd2cf13cfb",
      200, 0,
      "ServiceTreeWithMultipleChildren_serviceInstance",
    );
  });
  cy.openIframe(`app/ui/#/servicePlanning/${viewOrEdit}?serviceModelId=${SERVICE_MODEL_ID}&subscriberId=${SUBSCRIBER_ID}&serviceType=${SERVICE_TYPE}&serviceInstanceId=${SERVICE_INSTANCE_ID}`);
};


describe('View Edit Page: Upgrade VFModule', function () {
  describe('basic UI tests', () => {
    let serviceUuid = SERVICE_MODEL_ID;
    let serviceInvariantId = "d27e42cf-087e-4d31-88ac-6c4b7585f800";

    let jsonBuilderAAIService: JsonBuilder<ServiceModel> = new JsonBuilder<ServiceModel>();
    let jsonBuilderAAISubViewEditModel: JsonBuilder<AAISubViewEditModel> = new JsonBuilder<AAISubViewEditModel>();
    let jsonBuilderAaiServiceInstances: JsonBuilder<AaiServiceInstancesModel> = new JsonBuilder<AaiServiceInstancesModel>();

    beforeEach(() => {
      cy.window().then((win) => {
        win.sessionStorage.clear();
      });
      cy.readFile('cypress/support/jsonBuilders/mocks/jsons/basicService.json').then((res) => {
        jsonBuilderAAIService.basicJson(
          res,
          Cypress.config('baseUrl') + "/rest/models/services/" + serviceUuid,
          200, 0,
          "service-complexService",
          changeServiceModel)
      });

      cy.readFile('cypress/support/jsonBuilders/mocks/jsons/aaiSubViewEditForComplexService.json').then((res) => {
        jsonBuilderAAISubViewEditModel.basicJson(
          res,
          Cypress.config('baseUrl') + "/aai_sub_viewedit/**/**/**/3f93c7cb-2fd0-4557-9514-e189b7b04f9d",
          200,
          0,
          "aai-sub-view-edit")
      });

      cy.readFile('cypress/support/jsonBuilders/mocks/jsons/aaiServiceInstances.json').then((res) => {
        jsonBuilderAaiServiceInstances.basicJson(
          res,
          Cypress.config('baseUrl') + "/search_service_instances**",
          200,
          0,
          "aai-get-service-instances")
      });

      mockAsyncBulkResponse();
      cy.initGetAAISubDetails();
      cy.initVidMock({serviceUuid: serviceUuid, invariantId: serviceInvariantId});
      cy.setReduxState();
      cy.permissionVidMock();
      cy.login();
    });

    afterEach(() => {
      cy.screenshot();
    });

    it(`should display the more actions button if user is permitted`, function () {
      let SERVICE_INSTANCE_ID="3f93c7cb-2fd0-4557-9514-e189b7b04f9d";
      let SERVICE_TYPE="VIRTUAL%20USP";
      cy.visit(`/serviceModels.htm#/instantiate?subscriberId=${SUBSCRIBER_ID}&subscriberName=USP%20VOICE&serviceType=${SERVICE_TYPE}&serviceInstanceId=${SERVICE_INSTANCE_ID}&aaiModelVersionId=${serviceUuid}&isPermitted=true`);

      cy.get("[data-tests-id='service-instanceId-th-id']").should('contain', SERVICE_INSTANCE_ID);
      cy.getElementByDataTestsId("show-new-screen").should('be.visible').should('have.text', 'More actions').click();

      cy.url().should('contain',
        `servicePlanning/EDIT?serviceModelId=${serviceUuid}&subscriberId=${SUBSCRIBER_ID}&serviceType=${SERVICE_TYPE}&serviceInstanceId=${SERVICE_INSTANCE_ID}`);
    });

    it(`Upgrade a VFModule`, function () {
      cy.initDrawingBoardUserPermission();
      initServicePlanning("EDIT",
        '../vid-automation/src/test/resources/viewEdit/ServiceTreeWithMultipleChildren_serviceInstance_withUpdatedLatestVersion.json');
      upgradeTheVFM();
      undoUpgradeForVFM();
      upgradeTheVFM();
      cy.getDrawingBoardDeployBtn().click();
      cy.wait('@expectedPostAsyncInstantiation').then(xhr => {
        expect(Object(xhr.request.body).action).to.equal("None_Upgrade");
        expect(Object(xhr.request.body).vnfs['VNF2_INSTANCE_ID'].action).to.equal("None_Upgrade");
        expect(Object(xhr.request.body).vnfs['VNF2_INSTANCE_ID'].vfModules['dc229cd8-c132-4455-8517-5c1787c18b14']['3ef042c4-259f-45e0-9aba-0989bd8d1cc5'].action).to.equal("None_Upgrade");
      });
    });

    it(`Upgrade a VFModule, Negative - latest version doesn't exist, upgrade button shouldn't exist`, function () {
      setLatestVersionMockToEmptyResponse(serviceInvariantId);
      cy.initDrawingBoardUserPermission();
      initServicePlanning("EDIT",
        '../vid-automation/src/test/resources/viewEdit/ServiceTreeWithMultipleChildren_serviceInstance_withUpdatedLatestVersion.json');
      verifyMenuActionUpgradeDoesNotExist();
    });

  });

  function mockAsyncBulkResponse() {
    cy.server().route({
      url: Cypress.config('baseUrl') + '/asyncInstantiation/bulk',
      method: 'POST',
      status: 200,
      response: "[]",
    }).as("expectedPostAsyncInstantiation");
  }

  function verifyMenuActionUpgradeDoesNotExist() {
    cy.getElementByDataTestsId('node-undefined-dc229cd8-c132-4455-8517-5c1787c18b14-menu-btn').click()
    .getElementByDataTestsId('context-menu-upgrade').should('not.exist');
  }

  function setLatestVersionMockToEmptyResponse(serviceUuid: string) {
    cy.server().route({
      url: Cypress.config('baseUrl') + '/aai_get_newest_model_version_by_invariant/' + serviceUuid,
      method: 'GET',
      status: 200,
      response: {},
    }).as("expectLatestServiceModelUpgradeVersion")
  }

  function upgradeTheVFM(): Chainable<any> {
    return cy.getElementByDataTestsId('node-undefined-dc229cd8-c132-4455-8517-5c1787c18b14-menu-btn').click()
    .drawingBoardTreeClickOnContextMenuOptionByName("Upgrade");
  }

  function undoUpgradeForVFM() {
    cy.getElementByDataTestsId('node-undefined-dc229cd8-c132-4455-8517-5c1787c18b14-menu-btn').click()
    .drawingBoardTreeClickOnContextMenuOptionByName("Undo Upgrade");
  }

  function changeServiceModel(serviceModel: ServiceModel) {
    serviceModel.service.uuid = "6e59c5de-f052-46fa-aa7e-2fca9d674c44";
    return serviceModel;
  }
});
