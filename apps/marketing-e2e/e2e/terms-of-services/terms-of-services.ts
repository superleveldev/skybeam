import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Scenario: Viewing the Terms of Services Page
Given('I am navigating the website', () => {
  cy.visit('/');
});

When('I click on the Terms of Services link in the footer', () => {
  cy.get('[data-test-nav-btn="/terms-of-services"]').click();
});

Then(
  'I should be directed to a static page displaying the complete terms of services',
  () => {
    cy.location('pathname').should('equal', '/terms-of-services');
  },
);

Then('the page should include Last Updated date at the top', () => {
  cy.get('[data-test-last-updated-date]');
});

Then('the page should include title {string}', (title: string) => {
  cy.get('h1').should('contain', title);
});

Then('the page should include Section headers:', (DataTable) => {
  cy.get('[data-test-text-area]').as('textContent');
  for (let i = 0; i < DataTable['rawTable'].length; i++)
    cy.get('@textContent').should('contain.text', DataTable['rawTable'][i][0]);
});
