import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Footer navigation
Given('I open home page', () => {
  cy.visit('/');
  cy.location('pathname').should('equal', '/');
});

When('I click {string}', (navOption: string) => {
  cy.get(`[data-test-nav-btn="${navOption}"]`).click();
  cy.location('pathname').should('not.equal', '/');
});

Then("I'm redirected to {string} page", (navOption: string) => {
  cy.location('pathname').should(
    'equal',
    `/${navOption.toLowerCase().replace(' ', '-')}`,
  );
});
