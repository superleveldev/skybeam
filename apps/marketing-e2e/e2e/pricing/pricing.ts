import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Viewing Pricing Plans
Given('I am navigating the pricing page', () => {
  cy.visit('http://localhost:3002/pricing');
});

Then(
  'I should be directed to a static page displaying section {string}',
  (basicPlan: string) => {
    cy.get('[data-test-basic-plan-section]').should('contain.text', basicPlan);
  },
);

Then('{string} title are shown', (mainTitle: string) => {
  cy.get('h1').should('be.visible').and('contain.text', mainTitle);
});

Then(
  'the {string} section should include the following details:',
  (plan: string, DataTable) => {
    // cy.get('[data-test-basic-plan-section]').should('contain.text', plan);
    for (let i = 0; i < DataTable['rawTable'].length; i++) {
      cy.get('[data-test-basic-plan-section]').should(
        'contain.text',
        DataTable['rawTable'][i][0],
      );
    }
  },
);

Then(
  '{string} title and images are shown in middle of page',
  (title: string) => {
    cy.get('[data-test-middle-title]')
      .should('contain.text', title)
      .should('be.visible');
    cy.get('[data-test-images]').should('be.visible');
  },
);

Then('{string} title shown at the bottom', (title: string) => {
  cy.get('[data-test-faq-section-title]')
    .should('contain.text', title)
    .should('be.visible');
});

// FAQ section dropdowns
Given('all dropdowns are closed', () => {
  cy.get('[data-test-faq-dropdown-item]').eq(0).click();
  cy.get('[data-test-faq-dropdown-item]')
    .eq(0)
    .invoke('attr', 'class')
    .should('not.contain', 'open');
});

When('I click on FAQ {int} with {string}', (id: number, title: string) => {
  cy.get('[data-test-faq-dropdown-item]').as('faqItem');
  cy.get('@faqItem').should('contain.text', title);
  cy.get('@faqItem').eq(id).click();
});

Then(
  '{string} appears in dropdown {int}',
  (faqSectionContent: string, id: number) => {
    cy.get('[data-test-faq-dropdown-text]').as('faqSectionContent');
    cy.get('@faqSectionContent')
      .eq(id)
      .invoke('attr', 'class')
      .should('contain', 'open');
    cy.get('@faqSectionContent')
      .eq(id)
      .should('contain.text', faqSectionContent);
  },
);

// Redirecting to 'Sign Up' page after clicking 'Get Started' buttons
When('I click Get Started button in {string}', (buttonLocation: string) => {
  cy.get(`[data-test-get-started-${buttonLocation}-btn]`).click({
    force: true,
  });
});

// Scenario: Call to actions component
Then('call to actions component appears on page', () => {
  cy.get('[data-test-call-to-actions-component]').should('be.visible');
});
