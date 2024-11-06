import data from '../../fixtures/targeting-groups.json';
import campaignData from '../../fixtures/campaigns.json';
describe('Creating a Targeting Group', () => {
  beforeEach(() => {
    cy.visit('/sign-in');
    cy.clerkSignIn({
      strategy: 'password',
      identifier: Cypress.env('testUserEmail'),
      password: Cypress.env('testUserPassword'),
    });
  });
  it('allows the user to create a new targeting group', () => {
    const name = `${new Date().toISOString()} Test Targeting Group`;
    cy.request(
      `${campaignData.getCampaignsUrl}${getInput(
        campaignData.indexParams['test-dup'],
      )}`,
    ).then((response) => {
      const campaignId = response.body[0]?.result?.data?.json?.data[0].id;
      cy.visit(`/campaigns/${campaignId}/targeting-groups/new`);
      cy.get('input[name="name"]').type(name);
      cy.get('input[name="name"]').should('have.value', name);
      cy.get('input[name="budget"]').dblclick();
      cy.get('input[name="budget"]').type(data.initialBudget);
      cy.get('input[name="budget"]').should('have.value', data.initialBudget);
      // cy.get('[title="Test Creative"]').click();
      // cy.get('button')
      //   .contains(/Save and Review Campaign/)
      //   .click();
      // cy.location('pathname').should('eq', `/campaigns/${campaignId}/summary`);
      // cy.get('a[href*="summary"]').scrollIntoView();
      // cy.get('a').contains(name).click();
      // cy.location('pathname').should(
      //   'match',
      //   RegExp(`/campaigns/${campaignId}/targeting-groups/[a-z0-9-]+/edit`),
      // );
      // cy.get('input[name="name"]').should('have.value', name);
      // cy.get('input[name="budget"]').should('have.value', data.initialBudget);
      // cy.get('input[name="budget"]').type(data.budgetChange);
      // cy.get('button')
      //   .contains(/Save Draft/)
      //   .click();
      // cy.location('pathname').should('eq', '/campaigns');
      // cy.go('back', { timeout: 10000 });
      // cy.location('pathname').should(
      //   'match',
      //   RegExp(`/campaigns/${campaignId}/targeting-groups/[a-z0-9-]+/edit`),
      // );
      // cy.get('input[name="budget"]').should('have.value', data.finalBudget);
    });
  });
});

function getInput(input: Record<string, any>) {
  return encodeURIComponent(JSON.stringify(input));
}
