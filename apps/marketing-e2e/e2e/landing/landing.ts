import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Background
Given('I visit landing page', () => {
  cy.visit('/');
});

Given('all dropdowns are closed', () => {
  cy.get('[data-test-faq-dropdown-item]').eq(0).click();
  cy.get('[data-test-faq-dropdown-item]')
    .eq(0)
    .invoke('attr', 'class')
    .should('not.contain', 'open');
});

// FAQs text dropdowns
When('I click on FAQ {int}', (id: number) => {
  cy.get('[data-test-faq-dropdown-item]').eq(id).click();
});

Then('addtitional text appears in {int}', (id: number) => {
  cy.get('[data-test-faq-dropdown-text]')
    .eq(id)
    .invoke('attr', 'class')
    .should('contain', 'open');
});

// Redirecting to 'Sign Up' page after clicking 'Get Started' buttons
When('I click Get Started button in {string}', (buttonLocation: string) => {
  cy.get(`[data-test-get-started-${buttonLocation}-btn]`).click({
    force: true,
  });
});

// Call to Action and Key Features Visibility
Then('{string} title displays', (title: string) => {
  cy.get('h1').should('contain.text', title);
});

Then('next text shows under title:', (docString: string) => {
  cy.get('[data-test-text-under-title]').should(
    'contain.text',
    docString.replace('\n', ''),
  );
});

Then('{string} first subtitle displays', (firstSubtitle: string) => {
  cy.get('[data-test-first-subtitle]').should('contain.text', firstSubtitle);
});

Then('{string} second subtitle displays', (secondSubtitle: string) => {
  cy.get('[data-test-second-subtitle]').should('contain.text', secondSubtitle);
});

Then('Advertise on section displays', () => {
  cy.get('[data-test-advertise-on]').contains('Advertise on');
  cy.get('[data-test-img-section]');
});

Then('Powered by section contain text:', (docString: string) => {
  cy.get('[data-test-simulmedia-section]').should(
    'contain.text',
    docString.replace(/\n/g, ''),
  );
});
