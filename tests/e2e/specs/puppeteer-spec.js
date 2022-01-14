describe('Puppeteer', () => {
  context('Test commands', () => {
    it(`initPuppeteer should connect with cypress browser`, () => {
      cy.initPuppeteer().then(isConnected => {
        expect(isConnected).to.be.true;
      });
    });
    it(`assignActiveTabName should properly assign blank tab as currently active and verify result using isBlankWindowActive & isCypressWindowActive`, () => {
      cy.assignActiveTabName('blank');
      cy.isBlankWindowActive().then(isActive => {
        expect(isActive).to.be.true;
      });
      cy.isCypressWindowActive().then(isActive => {
        expect(isActive).to.be.false;
      });
    });
    it(`assignWindows should properly assign cypress and blank windows`, () => {
      cy.assignWindows().then(assigned => {
        expect(assigned).to.be.true;
      });
    });
    it(`switchToCypressWindow should properly switch active tab to cypress window`, () => {
      cy.switchToCypressWindow();
      cy.isCypressWindowActive().then(isActive => {
        expect(isActive).to.be.true;
      });
      cy.isBlankWindowActive().then(isActive => {
        expect(isActive).to.be.false;
      });
    });
    it(`switchToBlankWindow should properly switch active tab to blank window`, () => {
      cy.switchToBlankWindow();
      cy.isBlankWindowActive().then(isActive => {
        expect(isActive).to.be.true;
      });
      cy.isCypressWindowActive().then(isActive => {
        expect(isActive).to.be.false;
      });
    });
  });
});
