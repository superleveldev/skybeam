import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Background
Given('I visit landing page', () => {
  cy.visit('/');
});

// Header links

When('I click {string}', (navOption: string) => {
  cy.get('[data-test-header]')
    .find(`[data-test-nav-btn="${navOption}"]`)
    .click();
});

// Burger menu options
Given(
  'I visit landing page with window size {int} and {int}',
  (weight: number, height: number) => {
    cy.viewport(weight, height);
    cy.visit('/');
  },
);

When('I open burger menu', () => {
  cy.get('[data-test-burger-menu]').click();
});

When('I select {string}', (navOption: string) => {
  cy.get('[data-test-mobile-navbar]')
    .find(`[data-test-nav-btn="${navOption}"]`)
    .click();
});

Then("I'm redirecting to {string} page", (navOption: string) => {
  cy.location('pathname').should('equal', `/${navOption}`);
});

// Redirecting to 'Sign Up' and 'Log in' page using navbar
When('I click {string} button', (buttonName: string) => {
  cy.get(`[data-test-${buttonName}-btn]`).click();
});

Then("I'm redirected to {string} page", (buttonName: string) => {
  cy.location('pathname').should('equal', buttonName);
});
