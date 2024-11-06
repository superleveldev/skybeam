export const getPlaceholder = () => cy.get('main');

export const getFirstRowCells = () =>
  cy.get('[data-testid="campaign-list-body"] tr').first().children();
