describe('Creating a new campaign', () => {
  beforeEach(() => {
    cy.visit('/sign-in');
    cy.clerkSignIn({
      strategy: 'password',
      identifier: Cypress.env('testUserEmail'),
      password: Cypress.env('testUserPassword'),
    });
  });
  it('allows the user to create a new advertiser', () => {
    const advertiserName = `Test Advertiser ${new Date().toISOString()}`;
    const advertiserWebsite = `test.advertiser.${new Date().toISOString()}`;
    cy.visit('/campaigns/new');
    cy.get('[role="combobox"][data-testid="add-advertiser-trigger"]').click();
    cy.get('button')
      .contains(/Add Advertiser/)
      .click();
    cy.get('input[placeholder="Company Name"]').type(advertiserName);
    cy.get('input[placeholder="Company Name"]').should(
      'have.value',
      advertiserName,
    );
    cy.get('input[name="website"]').type(advertiserWebsite);
    cy.get('input[name="website"]').should('have.value', advertiserWebsite);
    cy.get('[role="combobox"][data-testid="add-industry-trigger"]').click();
    cy.get('[role="option"]').first().click();
    cy.get('button')
      .contains(/Add Advertiser/)
      .click();
    cy.get('[role="combobox"][data-testid="add-advertiser-trigger"]').click();
    cy.get('[role="option').contains(advertiserName).click();
    cy.get('[role="combobox"][data-testid="add-advertiser-trigger"]').contains(
      advertiserName,
    );
  });
  it('allows the user to create a campaign', () => {
    const campaignName = `Test Campaign ${new Date().toISOString()}`;
    cy.visit('/campaigns/new');
    cy.get('h1')
      .contains(/New Campaign/)
      .should('exist');
    cy.get('input[name="name"]').type(campaignName);
    cy.get('input[name="name"]').should('have.value', campaignName);
    cy.get('[role="combobox"][data-testid="add-advertiser-trigger"]').click();
    cy.get('[role="option"]').first().click();
    cy.get('button[role="radio"][value="awareness"]').click();
    cy.get('button[role="radio"][value="daily"]').click();
    cy.get('input[name="budget"]').clear();
    cy.get('input[name="budget"]').type('1000');
    cy.get('input[name="budget"]').should('have.value', '1,000');
    cy.get('[data-testid="start-date"]').click();
    cy.get('[data-testid="start-date-calendar"]').should('be.visible');
    cy.get('[name="next-month"]').first().click();
    cy.get('[name="day"]').contains(/^2$/).click();
    cy.get('div')
      .contains(/Timeline/)
      .click();
    cy.get('[data-testid="start-date-calendar"]').should('not.exist');
    cy.get('[data-testid="end-date"]').click();
    cy.get('[data-testid="end-date-calendar"]').should('be.visible');
    cy.get('[name="next-month"]').last().click();
    cy.get('[name="day"]').contains('15').click();
    cy.get('input[type="time"]').first().type('08:00');
    cy.get('input[type="time"]').last().type('18:00');
    cy.get('[data-testid="timezone-trigger"]').click();
    cy.get('[role="option"]').first().click();
    cy.get('button')
      .contains(/Save Draft/)
      .click();
    cy.location('pathname').should('eq', '/campaigns');
    cy.visit('/campaigns?sort=-updatedAt');
    cy.get('td').contains(campaignName).should('exist');
  });
  it('prevents the user from creating a campaign with the same name', () => {
    cy.intercept('POST', '/campaigns/new').as('createCampaign');
    cy.visit('/campaigns/new');
    cy.get('input[name="name"]').type('Test Dup Name');
    cy.get('[role="combobox"][data-testid="add-advertiser-trigger"]').click();
    cy.get('[role="option"]').contains('Test Dup Advertiser').click();
    cy.get('button')
      .contains(/Save Draft/)
      .click();
    cy.wait('@createCampaign');
    cy.get('[data-testid="campaign-name-message"]', { timeout: 5000 })
      .should('exist')
      .contains('Campaign name must be unique');
  });
});
