import { capitalize } from '@limelight/shared-utils/index';
import {
  infoCardText,
  indexParams,
  getCampaignsUrl,
} from '../../fixtures/campaigns.json';
import { getFirstRowCells } from '../../support/app.po';

describe('Viewing campaigns list', () => {
  beforeEach(() => {
    cy.visit('/sign-in');
    cy.clerkSignIn({
      strategy: 'password',
      identifier: Cypress.env('testUserEmail'),
      password: Cypress.env('testUserPassword'),
    });
  });

  it('allows the user to delete a campaign', () => {
    cy.request(`${getCampaignsUrl}${getInput(indexParams.default)}`).then(
      (response) => {
        const campaigns = response.body[0]?.result?.data?.json?.data;

        cy.visit('/campaigns?sort=-updatedAt');
        getFirstRowCells()
          .first()
          .should('have.text', capitalize(campaigns.at(0).name));
        getFirstRowCells().last().click();
        cy.get('[role="menuitem"]', { timeout: 1000 })
          .contains('Delete')
          .click();
        cy.visit(`/campaigns/delete/${campaigns.at(0).id}`);
        cy.get('button').contains('Delete Campaign', { timeout: 1000 }).click();
        cy.visit('/campaigns?sort=-updatedAt');
        getFirstRowCells()
          .first()
          .should('not.have.text', capitalize(campaigns.at(0).name));
        getFirstRowCells()
          .first()
          .should('have.text', capitalize(campaigns.at(1).name));
      },
    );
  });

  it('displays info cards', () => {
    cy.visit('/campaigns');
    cy.get(`[data-testid="${infoCardText.pixelSetup}"]`).contains(
      infoCardText.pixelSetup,
    );
    cy.get(`[data-testid="${infoCardText.creativesPreparation}"]`).contains(
      infoCardText.creativesPreparation,
    );
    cy.get(`[data-testid="${infoCardText.creativesGeneration}"]`).contains(
      infoCardText.creativesGeneration,
    );
  });

  it('allows sort', () => {
    cy.request(`${getCampaignsUrl}${getInput(indexParams.sort1)}`).then(
      (response) => {
        const campaigns = response.body[0]?.result?.data?.json?.data;
        cy.visit('/campaigns?sort=name');
        getFirstRowCells()
          .first()
          .contains(capitalize(campaigns.at(0).name));
      },
    );
    cy.request(`${getCampaignsUrl}${getInput(indexParams.sort2)}`).then(
      (response) => {
        const campaigns = response.body[0]?.result?.data?.json?.data;
        cy.visit('/campaigns?sort=-name');
        getFirstRowCells()
          .first()
          .contains(capitalize(campaigns.at(0).name));
      },
    );
  });

  it('allows the user to search', () => {
    cy.request(`${getCampaignsUrl}${getInput(indexParams.search1)}`).then(
      (response) => {
        const campaign = response.body[0]?.result?.data?.json?.data?.at(0);
        cy.visit('/campaigns');
        cy.get('input[type="search"]').type(indexParams.search1[0].json.search);
        getFirstRowCells().first().contains(capitalize(campaign.name));
      },
    );

    cy.request(`${getCampaignsUrl}${getInput(indexParams.search2)}`).then(
      (response) => {
        const campaign = response.body[0]?.result?.data?.json?.data?.at(0);
        cy.url().should(
          'include',
          `search=${indexParams.search1[0].json.search.replaceAll(' ', '+')}`,
        );
        cy.get('input[type="search"]').clear();
        cy.get('input[type="search"]').type(indexParams.search2[0].json.search);
        getFirstRowCells().first().contains(capitalize(campaign.name));
        cy.url().should(
          'include',
          `search=${indexParams.search2[0].json.search.replaceAll(' ', '+')}`,
        );
      },
    );
  });

  it('allows the user to filter by status', () => {
    cy.visit('/campaigns');
    cy.get('[data-testid="status-dropdown"]')
      .contains('Status')
      .should('exist')
      .click();
    cy.get('a')
      .contains('Draft')
      .should('have.attr', 'href', '/campaigns?status=draft');
    cy.get('a')
      .contains('Published')
      .should('have.attr', 'href', '/campaigns?status=published');
    cy.get('a')
      .contains('Finished')
      .should('have.attr', 'href', '/campaigns?status=finished');
    cy.get('a')
      .contains('All')
      .invoke('attr', 'href')
      .should('not.contain', 'status');
    cy.visit('/campaigns?status=draft');
    cy.get('[data-testid="status-dropdown"]').should('contain', 'Draft');
    cy.visit('/campaigns?status=published');
    cy.get('[data-testid="status-dropdown"]').should('contain', 'Published');
    cy.visit('/campaigns?status=finished');
    cy.get('[data-testid="status-dropdown"]').should('contain', 'Finished');
  });
});

function getInput(input: Record<string, any>) {
  return encodeURIComponent(JSON.stringify(input));
}
