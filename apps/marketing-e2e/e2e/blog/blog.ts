import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

Given('I visit resourses page', () => {
  cy.visit('/resources');
});

// Scenario: Displaying Articles
Then('I should see a list of articles', () => {
  cy.get('[data-test-article-item]').should('be.visible');
});

Then('{string} title and title image are displayed', (mainTitle: string) => {
  cy.get('[data-test-main-title]').should('contain.text', mainTitle);
  cy.get('[data-test-title-img]').should('be.visible');
});

Then('each article preview should display the following:', (DataTable) => {
  const dataList = DataTable['rawTable'];
  for (let i = 0; i < dataList.length; i++)
    cy.get('[data-test-article-item]')
      .find(`[data-test-${dataList[i]}]`)
      .should('be.visible');
});

// Scenario: Article Clickthrough
Given("I click on an article preview and I'm redirected to the article", () => {
  cy.get('[data-test-article-link]')
    .eq(0)
    .then(($link) => {
      cy.intercept('GET', `**${$link.attr('href')}**`).as('article');
      cy.get('[data-test-article-link]').eq(0).click();
      cy.wait('@article');
      cy.url().should('include', $link.attr('href'));
    });
});

Then(
  'article page contains complete content, images, and related categories',
  () => {
    cy.get('[data-test-category]').should('be.visible');
    cy.get('[data-test-main-title]').should('be.visible');
    cy.get('[data-test-subtitle]').should('be.visible');
    cy.get('[data-test-img]').should('be.visible');
    cy.get('[data-test-publisher]').should('be.visible');
    cy.get('[data-test-text-area]').should('be.visible');
    cy.get('[data-test-additional-articles-section]').should('be.visible');
  },
);

When('I click back to all articles', () => {
  cy.get('[data-test-all-blogs-btn]').click();
});

Then("I'm redirected to the resourses page", () => {
  cy.location('pathname').should('equal', '/resources');
});

// Scenario: Filtering articles
When('I click on {string} category', (categoryName: string) => {
  cy.intercept('GET', '**/resources?category=**').as('getCategories');
  cy.get(`[data-test-filter="${categoryName}"]`).click();
});

Then(
  'the page contains only article previews that belong to the {string} category',
  (categoryName: string) => {
    cy.wait('@getCategories').then((interception) => {
      expect(interception.response.statusCode).to.eq(200);
    });
    cy.url().should('include', `?category=${categoryName.replace(/ /g, '+')}`);
    cy.get('[data-test-category]').each(($el) => {
      cy.get(`[data-test-filter="${categoryName}"]`).then(($category) => {
        expect($category.text()).equal($el.text());
      });
    });
  },
);

// Scenario: Call to Action Feature
Then('call to action feature displayed', () => {
  cy.get('[data-test-call-to-actions-component]').should('be.visible');
});
