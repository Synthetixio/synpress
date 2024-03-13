describe('Playwright', () => {
  context('Test commands', () => {
    it(`initPlaywright should connect with cypress browser`, () => {
      cy.initPlaywright().then(isConnected => {
        expect(isConnected).to.be.true;
      });
    });
    it(`assignActiveTabName should properly assign metamask tab as currently active and verify result using isMetamaskWindowActive & isCypressWindowActive`, () => {
      cy.assignActiveTabName('metamask');
      cy.isMetamaskWindowActive().then(isActive => {
        expect(isActive).to.be.true;
      });
      cy.isCypressWindowActive().then(isActive => {
        expect(isActive).to.be.false;
      });
    });
    it(`assignWindows should properly assign cypress and metamask windows`, () => {
      cy.assignWindows().then(assigned => {
        expect(assigned).to.be.true;
      });
    });
    it(`switchToCypressWindow should properly switch active tab to cypress window`, () => {
      cy.switchToCypressWindow();
      cy.isCypressWindowActive().then(isActive => {
        expect(isActive).to.be.true;
      });
      cy.isMetamaskWindowActive().then(isActive => {
        expect(isActive).to.be.false;
      });
    });
    it(`switchToMetamaskWindow should properly switch active tab to metamask window`, () => {
      cy.switchToMetamaskWindow();
      cy.isMetamaskWindowActive().then(isActive => {
        expect(isActive).to.be.true;
      });
      cy.isCypressWindowActive().then(isActive => {
        expect(isActive).to.be.false;
      });
    });
  });
});
