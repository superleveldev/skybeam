describe('limelight-e2e', () => {
  it('lets the user sign in', () => {
    cy.visit('/sign-in');
    cy.clerkSignIn({
      strategy: 'password',
      identifier: Cypress.env('testUserEmail'),
      password: Cypress.env('testUserPassword'),
    });
    cy.visit('/campaigns');
    cy.get('h1').contains(/Campaigns/);
  });
});
