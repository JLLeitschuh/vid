///<reference path="../../../node_modules/cypress/types/index.d.ts"/>
describe('Template', () => {

  beforeEach(() => {
    cy.clearSessionStorage();
    cy.setReduxState();
    cy.preventErrorsOnLoading();
    cy.initAAIMock();
    cy.initVidMock();
    cy.login();
  });

  afterEach(() => {
    cy.screenshot();
  });

  it('when open service popup should show template button', function () {
    cy.readFile('cypress/support/jsonBuilders/mocks/jsons/flags.cypress.json').then((flags) => {
      cy.server()
        .route({
          method: 'GET',
          delay: 0,
          status: 200,
          url: Cypress.config('baseUrl') + "/flags**",
          response: {
            "FLAG_VF_MODULE_RESUME_STATUS_CREATE": false,
            "FLAG_2004_INSTANTIATION_TEMPLATES_POPUP": true
          }
        }).as('initFlags');
    });

    const asyncInstantiation = [
      {
        "id": 8,
        "created": 1525075968000,
        "modified": 1525075971000,
        "action": "INSTANTIATE",
        "createdId": null,
        "modifiedId": null,
        "rowNum": null,
        "auditUserId": null,
        "auditTrail": null,
        "jobId": "5c2cd8e5-27d0-42e3-85a1-85db5eaba459",
        "templateId": "d42ba7c8-9e19-4e34-ae2c-d8af3f24498e",
        "userId": "16807000",
        "aLaCarte": false,
        "msoRequestId": "c0011670-0e1a-4b74-945d-8bf5aede1d9c",
        "jobStatus": "FAILED",
        "statusModifiedDate": 1525075968000,
        "hidden": false,
        "pause": false,
        "owningEntityId": "d61e6f2d-12fa-4cc2-91df-7c244011d6fc",
        "owningEntityName": "WayneHolland",
        "project": "WATKINS",
        "aicZoneId": "NFT1",
        "aicZoneName": "NFTJSSSS-NFT1",
        "tenantId": "bae71557c5bb4d5aac6743a4e5f1d054",
        "tenantName": "AIN Web Tool-15-D-testalexandria",
        "regionId": "hvf6",
        "regionName": null,
        "serviceType": "TYLER SILVIA",
        "subscriberName": "e433710f-9217-458d-a79d-1c7aff376d89",
        "serviceInstanceId": null,
        "serviceInstanceName": "nWUfl instance name_002",
        "serviceModelId": "e49fbd11-e60c-4a8e-b4bf-30fbe8f4fcc0",
        "serviceModelName": "action-data",
        "serviceModelVersion": "1.0",
        "createdBulkDate": 1525075968000,
        "isRetryEnabled": true
      }
    ];

    cy.route(Cypress.config('baseUrl') + "/asyncInstantiation**", asyncInstantiation);

    cy.openIframe('/app/ui/#/servicePopup?serviceModelId=2f80c596-27e5-4ca9-b5bb-e03a7fd4c0fd&isCreate=true');
    cy.getElementByDataTestsId('templateButton').contains('Template')
      .getElementByDataTestsId('templateButton').click({force: true}) // Open template Modal
      .getElementByDataTestsId('template-modal-title').contains('Templates') // Check Modal header
      .getElementByDataTestsId('description-part-1').contains('The following list presents previous instantiations done for this model in this version.')
      .getElementByDataTestsId('description-part-2').contains('You may use one of them as a baseline for your instantiation or start from scratch.')
      .getElementByDataTestsId('description-part-3').contains('Once you selecting one allows you to change the data before start instantiating.')


    //check table headers
    cy.get(`#header-userId`).contains('User ID');
    cy.get(`#header-createDate`).contains('Date');
    cy.get(`#header-instanceName`).contains('Instance Name');
    cy.get(`#header-instantiationStatus`).contains('Instantiation Status');
    cy.get(`#header-region`).contains('Region');
    cy.get(`#header-tenant`).contains('Tenant');
    cy.get(`#header-aicZone`).contains('AIC Zone');

    // check table body row
    cy.getElementByDataTestsId(`userId-${asyncInstantiation[0].jobId}`).contains('16807000');
    cy.getElementByDataTestsId(`createDate-${asyncInstantiation[0].jobId}`).contains('2018-04-30 11:12:48');
    cy.getElementByDataTestsId(`instanceName-${asyncInstantiation[0].jobId}`).contains('nWUfl instance name_002');
    cy.getElementByDataTestsId(`instantiationStatus-${asyncInstantiation[0].jobId}`).contains('FAILED');
    cy.getElementByDataTestsId(`region-${asyncInstantiation[0].jobId}`).contains('hvf6 (WAYNEHOLLAND)');
    cy.getElementByDataTestsId(`tenant-${asyncInstantiation[0].jobId}`).contains('AIN Web Tool-15-D-testalexandria');
    cy.getElementByDataTestsId(`aicZone-${asyncInstantiation[0].jobId}`).contains('NFTJSSSS-NFT1');


    //check load button is disabled
    cy.getElementByDataTestsId('LoadTemplateButton').should('be.disabled')
    cy.getElementByDataTestsId('row-5c2cd8e5-27d0-42e3-85a1-85db5eaba459').click();
    cy.getElementByDataTestsId('LoadTemplateButton').should('not.be.disabled')

  });
});
