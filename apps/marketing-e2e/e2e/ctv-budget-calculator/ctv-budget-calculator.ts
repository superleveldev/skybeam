import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Background: Visit Insights Hub
Given('I visit Insights Hub', () => {
  cy.visit('/insights');
});

// Scenario: CTV Budget Calculator overview
When("I'm on Insights Hub page", () => {
  cy.location('pathname').should('equal', '/insights');
});

Then('I can see budget calculator form which contain:', (DataTable) => {
  const dataList = DataTable['rawTable'];
  for (let i = 0; i < dataList.length; i++)
    cy.contains(dataList[i][0])
      .siblings()
      .should('contain.text', dataList[i][1]);
});

// Scenario: Calculation for campaign
When('I enter {int} in Monthly budget field', (budget: number) => {
  cy.get('[data-test-budget-input]').clear();
  cy.get('[data-test-budget-input]').type(String(budget));
});

When('I select Audience', () => {
  cy.get('[data-test-select-form]')
    .eq(1)
    .find('select')
    .select(1, { force: true });
});

When('I select {string} Location', (location: string) => {
  cy.get('[data-test-metro-area-button]').click();
  cy.get('[data-test-metro-area-search]').type(location);
  cy.get('[data-test-metro-area-item]').eq(0).click();
});

When('I click {string}', (buttonText: string) => {
  cy.get('[data-test-calculate-btn]')
    .should('contain.text', buttonText)
    .click();
});
