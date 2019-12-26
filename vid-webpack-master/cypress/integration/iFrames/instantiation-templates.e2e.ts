import * as _ from "lodash";
import {PropertyPath} from "lodash";

describe('Drawing Board: Instantiation Templates', function () {

  describe('Instantiation templates ', () => {

    beforeEach(() => {
      cy.clearSessionStorage();
      cy.setTestApiParamToGR();
      cy.initAAIMock();
      cy.initGetAAISubDetails();
      cy.initVidMock();
      cy.initDrawingBoardUserPermission();
      cy.login();

      mockAsyncBulkResponse();
    });

    afterEach(() => {
      cy.screenshot();
    });

    describe('Load Page and Deploy', () => {

      it(`Given a stored template - when click "deploy" - then a coherent request should be sent upon deploy`,  () => {

        loadDrawingBoardWithRecreateMode();

        // Then...
        cy.getElementByDataTestsId("node-vProbe_NC_VNF 0").should('be.visible');
        assertThatBodyFromDeployRequestEqualsToTemplateFromBackEnd();
      });

      it('Given a stored template - when "edit" vnf and vfmodules are opened - then template’s details are visible as expected and deploy without changes', () => {

        loadDrawingBoardWithRecreateMode();

        // Then...
        editNode("node-21ae311e-432f-4c54-b855-446d0b8ded72-vProbe_NC_VNF 0")
        .getElementByDataTestsId("instanceName").should('have.value', 'hvf6arlba007')
        .getElementByDataTestsId("productFamily").should('contain', 'Emanuel')
        .getElementByDataTestsId("tenant").should('contain', 'DN5242-Nov21-T1')
        .getElementByDataTestsId("lcpRegion").should('contain', 'hvf6')
        .getElementByDataTestsId("lineOfBusiness").should('contain', 'zzz1')
        .getElementByDataTestsId("rollback").should('contain', 'Rollback')
        .checkPlatformValue('xxx1')
         .getElementByDataTestsId("cancelButton").click();

        editNode("node-c5b26cc1-a66f-4b69-aa23-6abc7c647c88-vprobe_nc_vnf0..VprobeNcVnf..FE_base_module..module-0")
        .getElementByDataTestsId("instanceName").should('have.value', 'hvf6arlba007_lba_Base_01')
        .getElementByDataTestsId("lcpRegion").should('contain', 'hvf6')
        .getElementByDataTestsId("tenant").should('contain', 'DN5242-Nov21-T1')
        .getElementByDataTestsId("rollback").should('contain', 'Rollback')
        .getElementByDataTestsId("cancelButton").click();

        editNode("node-c09e4530-8fd8-418f-9483-2f57ce927b05-vprobe_nc_vnf0..VprobeNcVnf..FE_Add_On_Module_vlbagent_eph..module-1")
        .getElementByDataTestsId("instanceName").should('have.value', 'my_hvf6arlba007_lba_dj_01')
        .getElementByDataTestsId("volumeGroupName").should('have.value', 'my_special_hvf6arlba007_lba_dj_01_vol')
        .getElementByDataTestsId("lcpRegion").should('contain', 'hvf6')
        .getElementByDataTestsId("tenant").should('contain', 'DN5242-Nov21-T1')
        .getElementByDataTestsId("rollback").should('contain', 'Rollback')
        .getElementByDataTestsId("sdncPreLoad").should('have.value', 'on')
        .getElementByDataTestsId("cancelButton").click();

        assertThatBodyFromDeployRequestEqualsToTemplateFromBackEnd([
          {path: [...vnfPath, "vnfStoreKey"], value: "vProbe_NC_VNF 0"}, // side-effect
        ]);
        });

      it(`Given a stored template - when "edit" service is opened - then template’s details are visible as expected`,  function ()  {

        loadDrawingBoardWithRecreateMode();

        cy.openServiceContextMenu()
        .getElementByDataTestsId("context-menu-header-edit-item").click()
        .getElementByDataTestsId("instanceName").should('have.value', 'vProbe_NC_Service_DG_new_SI')
        .getElementByDataTestsId("subscriberName").should('contain', 'SILVIA ROBBINS')
        .getElementByDataTestsId("serviceType").should('contain', 'TYLER SILVIA')
        .getElementByDataTestsId("owningEntity").should('contain', 'WayneHolland')
        .getElementByDataTestsId("project").should('contain', 'WATKINS')
        .getElementByDataTestsId("rollback").should('contain', 'Rollback');

      });

      it(`Given a stored template - add one VfModule, edit its details, and deploy - deploy is added with the vfModule details`, () => {
        loadDrawingBoardWithRecreateMode();

        let newVfModuleName = "new.vfmodule.name";
        let module1ModelId = "VprobeNcVnf..FE_Add_On_Module_vlbagent_eph..module-1";
        let module1CustomizationId = `vprobe_nc_vnf0..${module1ModelId}`;

        // Click target VNF on right tree
        cy.getElementByDataTestsId('node-21ae311e-432f-4c54-b855-446d0b8ded72-vProbe_NC_VNF 0').click();

        // Click [+] vfModule on left tree
        cy.drawingBoardPressAddButtonByElementName(`node-${module1CustomizationId}`)
          .click({force: true});

        editNode(`node-c09e4530-8fd8-418f-9483-2f57ce927b05-${module1CustomizationId}`, 1);
          cy.clearInput("instanceName");
          cy.typeToInput("instanceName", newVfModuleName);
          cy.selectDropdownOptionByText('lcpRegion', 'hvf6');
          cy.selectDropdownOptionByText('tenant', 'DN5242-Nov21-T1');
          cy.getElementByDataTestsId('form-set').click();

        // Then...
        cy.getReduxState().then((state) => {
          let vfModules_1Path = [
            ...vnfPath, "vfModules", module1CustomizationId,
          ];

          let serviceInstanceElementOnRedux = state.service.serviceInstance[serviceModelId];
          let latestVfModule_1Path = findPathOfLatestVfModule(serviceInstanceElementOnRedux, vfModules_1Path);

          // This is a funny merge, as values are already there, but that way ensures
          // the values that selected are really deployed, while limiting the cost of
          // maintenance, by taking other vfModule's fields as granted.
          let latestVfModule_1ExpectedValue = _.merge(
            _.get(serviceInstanceElementOnRedux, latestVfModule_1Path),
            {
              instanceName: newVfModuleName,
              volumeGroupName: `${newVfModuleName}_vol`,
              lcpCloudRegionId: "hvf6",
              tenantId: "4914ab0ab3a743e58f0eefdacc1dde77",
            }
          );

          assertThatBodyFromDeployRequestEqualsToTemplateFromBackEnd([
            {path: [...vnfPath, "vnfStoreKey"], value: "vProbe_NC_VNF 0"},   // side-effect
            {path: ["existingNames", newVfModuleName], value: ""},
            {path: ["existingNames", `${newVfModuleName}_vol`], value: ""},
            {path: latestVfModule_1Path, value: latestVfModule_1ExpectedValue},
            {path: ["validationCounter"], value: null},  // side-effect
          ]);
        });

      });

      [
        {desc: "with changes", modifySomeValues: true},
        {desc: "without changes", modifySomeValues: false},
      ].forEach((testCase) => {

        it(`Given a stored template - edit service vnf and vfmodule ${testCase.desc} - deploy request should be ${testCase.desc}`, function () {

          loadDrawingBoardWithRecreateMode();

          //edit service
          cy.openServiceContextMenu();
          cy.getElementByDataTestsId("context-menu-header-edit-item").click();
          if (testCase.modifySomeValues) {
            cy.clearInput("instanceName");
            cy.typeToInput("instanceName", "different.instance.name");
          }
          cy.getElementByDataTestsId('form-set').click();

          // edit vnf
          editNode("node-21ae311e-432f-4c54-b855-446d0b8ded72-vProbe_NC_VNF 0");
          if (testCase.modifySomeValues) {
            cy.selectPlatformValue('platform');
            cy.selectDropdownOptionByText("tenant", "CESAR-100-D-spjg61909");
          }
          cy.getElementByDataTestsId('form-set').click();

          //edit vf module
          editNode("node-c5b26cc1-a66f-4b69-aa23-6abc7c647c88-vprobe_nc_vnf0..VprobeNcVnf..FE_base_module..module-0");
          if (testCase.modifySomeValues) {
            cy.getElementByDataTestsId('sdncPreLoad').click();
          }
          cy.getElementByDataTestsId('form-set').click();

          // Then...
          let vfModule_0Path = [
            ...vnfPath, "vfModules",
            "vprobe_nc_vnf0..VprobeNcVnf..FE_base_module..module-0",
            "vprobe_nc_vnf0..VprobeNcVnf..FE_base_module..module-0ahubg",
          ];

          assertThatBodyFromDeployRequestEqualsToFile(testCase.modifySomeValues ? [
            {path: ["instanceName"], value: "different.instance.name"},
            {path: ["existingNames", "vprobe_nc_service_dg_new_si"], value: undefined},
            {path: ["existingNames", "different.instance.name"], value: ""},

            {path: [...vnfPath, "platformName"], value: "xxx1,platform"},
            {path: [...vnfPath, "tenantId"], value: "f2f3830e4c984d45bcd00e1a04158a79"},

            {path: [...vfModule_0Path, "sdncPreLoad"], value: true},
          ] : []);
        })

      });

    });
  });
});

const serviceModelId = '6cfeeb18-c2b0-49df-987a-da47493c8e38';

const vnfPath = [
  "vnfs", "vProbe_NC_VNF 0"
];

function loadDrawingBoardWithRecreateMode() {
  const templateUuid = "46390edd-7100-46b2-9f18-419bd24fb60b";

  const drawingBoardAction = `RECREATE`;
  const templateTopologyEndpoint = "templateTopology";
  cy.route(`**/rest/models/services/${serviceModelId}`,
    'fixture:../support/jsonBuilders/mocks/jsons/instantiationTemplates/templates__service_model.json')
  .as('serviceModel');

  cy.route(`**/instantiationTemplates/${templateTopologyEndpoint}/${templateUuid}`,
    'fixture:../../../vid-automation/src/test/resources/asyncInstantiation/templates__instance_template.json')
  .as('templateTopology');

  // When...

  cy.openIframe(`app/ui/#/servicePlanning/${drawingBoardAction}` +
    `?jobId=${templateUuid}` +
    `&serviceModelId=${serviceModelId}`);

  cy.wait('@serviceModel');
  cy.wait('@templateTopology');
}

function editNode(dataTestId: string, index ?: number) {
  return cy.drawingBoardTreeOpenContextMenuByElementDataTestId(dataTestId, index)
    .drawingBoardTreeClickOnContextMenuOptionByName('Edit')
}

function assertThatBodyFromDeployRequestEqualsToTemplateFromBackEnd(deviationFromExpected: { path: PropertyPath, value: any }[] = []) {
  cy.getDrawingBoardDeployBtn().click();
  cy.wait('@expectedPostAsyncInstantiation').then(xhr => {
    cy.readFile('../vid-automation/src/test/resources/asyncInstantiation/templates__instance_template.json').then((expectedResult) => {
      convertRollbackOnFailureValueFromStringToBoolean(expectedResult);

      let xhrBodyWithoutIsDirtyField = removeIsDirtyFieldFromXhrRequestBody(xhr);
      setDeviationInExpected(expectedResult, deviationFromExpected);
      cy.deepCompare(xhrBodyWithoutIsDirtyField, expectedResult);
    });
  });
}


function assertThatBodyFromDeployRequestEqualsToFile(deviationFromExpected: { path: PropertyPath, value: any }[] = []) {
  cy.getDrawingBoardDeployBtn().click();
  cy.wait('@expectedPostAsyncInstantiation').then(xhr => {

    cy.readFile('../vid-automation/src/test/resources/asyncInstantiation/templates__instance_from_template__set_without_modify1.json').then((expectedResult) => {
      setDeviationInExpected(expectedResult, deviationFromExpected);
      cy.deepCompare(xhr.request.body, expectedResult);
    });

  });
}

function setDeviationInExpected(expectedResult: any, deviations: { path: PropertyPath; value: any }[]) {
  for (const deviation of deviations) {
    _.set(expectedResult, deviation.path, deviation.value);
  }
}

function findPathOfLatestVfModule(serviceInstanceElementFromRedux: any, vfModulesContainerPath: string[]) {
  let latestVfModuleRandomlySelectedKey: string = _.last(_.keys(
    _.get(serviceInstanceElementFromRedux, vfModulesContainerPath)
  )) as string;

  return [...vfModulesContainerPath, latestVfModuleRandomlySelectedKey];
}

  //We use this function because the deployService() on drawing-board-header.component class
  // changes rollbackOnFailure value from string type to boolean.
  function convertRollbackOnFailureValueFromStringToBoolean(expectedResult: any) {
    expectedResult.rollbackOnFailure = Boolean(expectedResult.rollbackOnFailure);
  }

function removeIsDirtyFieldFromXhrRequestBody(xhr : any) {
  let xhrTempBody = JSON.parse(JSON.stringify(xhr.request.body));
  delete xhrTempBody.isDirty;
  return xhrTempBody;
}

  function mockAsyncBulkResponse() {
    cy.server().route({
      url: Cypress.config('baseUrl') + '/asyncInstantiation/bulk',
      method: 'POST',
      status: 200,
      response: "[]",
    }).as("expectedPostAsyncInstantiation");
  }
