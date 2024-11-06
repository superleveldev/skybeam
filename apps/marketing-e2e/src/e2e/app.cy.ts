describe('limelight-e2e', () => {
  beforeEach(() => cy.visit('/'));

  it('should display main header text', () => {
    cy.get('body').contains('Supercharge');
  });
});
