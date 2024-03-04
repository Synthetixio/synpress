describe('Playwright', () => {
    context('Test commands', () => {
      it(`initPlaywright should connect with cypress browser`, () => {
        cy.initPlaywright().then(isConnected => {
          expect(isConnected).to.be.true;
        });
      });
      it(`assignActiveTabName should properly assign keplr tab as currently active and verify result using isKeplrWindowActive & isCypressWindowActive`, () => {
        cy.assignActiveTabName('keplr');
        cy.isExtensionWindowActive().then(isActive => {
          expect(isActive).to.be.true;
        });
        cy.isCypressWindowActive().then(isActive => {
          expect(isActive).to.be.false;
        });
      });
      it(`assignWindows should properly assign cypress and keplr windows`, () => {
        cy.assignWindows().then(assigned => {
          expect(assigned).to.be.true;
        });
      });
      it(`switchToCypressWindow should properly switch active tab to cypress window`, () => {
        cy.switchToCypressWindow();
        cy.isCypressWindowActive().then(isActive => {
          expect(isActive).to.be.true;
        });
        cy.isExtensionWindowActive().then(isActive => {
          expect(isActive).to.be.false;
        });
      });
      it(`switchToExtensionWindow should properly switch active tab to keplr window`, () => {
        cy.switchToExtensionWindow();
        cy.isExtensionWindowActive().then(isActive => {
          expect(isActive).to.be.true;
        });
        cy.isCypressWindowActive().then(isActive => {
          expect(isActive).to.be.false;
        });
      });
    });
  });