import { Given, Then, When } from '@badeball/cypress-cucumber-preprocessor';

// Background
Given('I am navigating the About Us Page', () => {
  cy.visit('/about');
});

// Scenario: Viewing company overview
Then('the page title should include {string}', (title: string) => {
  cy.get('[data-test-main-title]').and('contain.text', title);
});

Then(
  '{string} and {string} displays',
  (introInfo: string, imageBanner: string) => {
    cy.get(`[data-test-${introInfo}]`).should('be.visible');
    cy.get(`[data-test-${imageBanner}]`).should('be.visible');
  },
);

// Scenario: Our Team section
Then('{string} section displays', (teamTitle: string) => {
  cy.get('[data-test-team-section]')
    .find('[data-test-team-title]')
    .should('contain.text', teamTitle);
});

Then(
  '{string} displays with {string} and headshot',
  (person: string, role: string) => {
    cy.get('[data-test-person]').should('contain.text', person);
    cy.get('[data-test-role]').should('contain.text', role);
    cy.get('[data-test-headshot]').should('be.visible');
  },
);

Then('Powered by Simulmedia section displayed', () => {
  cy.get('[data-test-simulmedia-section]').should('be.visible');
});

// Scenario: Setup Hubspot meeting
When("I'm om the page, I can see HubSpot-Meeting component", () => {
  cy.location('pathname').should('equal', '/about');
  cy.intercept('GET', '**/app.hubspot.com/api/meetings-public/**').as(
    'getHubspotMeeting',
  );
  cy.intercept('POST', '**/exceptions.hubspot.com/api/**').as(
    'postHubspotMeeting',
  );
  cy.wait('@getHubspotMeeting');
  cy.wait('@postHubspotMeeting');
});

When('I can select next day', () => {
  cy.get('iframe').its('0.contentDocument.body').then(cy.wrap).as('iframe');
  cy.get('@iframe').find('[data-selenium-test-disabled="false"]').eq(1).click();
});

When('I can select meeting duration', () => {
  cy.get('@iframe')
    .find('button[data-button-use="tertiary-light"]')
    .contains(30)
    .click();
});

When('I can select {string} timeslot', (timeslot: string) => {
  cy.get('@iframe')
    .find('[data-test-id="time-picker-btn"]')
    .contains(timeslot)
    .click({ force: true });
});

When('I can fill first name, last name and email', () => {
  // Here we make a stub for our HubSpot api call
  cy.intercept('POST', '**/api.hubspot.com/meetings-public/v1/book**', {
    start: 1729778400000,
    duration: 900000,
    vid: 71176479402,
    subject: 'Hubspot meeting',
    contact: {
      name: 'Test Test',
      firstName: 'Test',
      lastName: 'Test',
      email: 'test@mail.com',
      userId: null,
    },
    organizer: {
      name: 'Developer Team',
      firstName: 'Developer',
      lastName: 'Team',
    },
    attendees: [],
    formFields: [],
    end: 1729779300000,
    bookingTimezone: 'Europe/Kiev',
    isOffline: false,
  });
  cy.get('@iframe').then(cy.wrap).find('[name="firstName"]').type('Cypress');
  cy.get('@iframe').then(cy.wrap).find('[name="lastName"]').type('Test');
  cy.get('@iframe').find('[name="email"]').type('cypressTest@mail.com');
  cy.get('@iframe')
    .find('[data-selenium-test="forward-button"]')
    .should(($button) => {
      expect($button.attr('aria-disabled')).to.equal('false');
    })
    .click();
});

Then('I see a notification about a successfully booked meeting', () => {
  cy.get('@iframe')
    .find('[data-test-id="profile-header"]')
    .should('contain.text', 'Booking confirmed');
});
