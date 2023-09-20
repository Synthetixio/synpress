const confirmationPage = '.confirmation-page';
const confirmationPageFooter = `${confirmationPage} .confirmation-footer`;
const footer = {
  footer: confirmationPageFooter,
  cancelButton: `${confirmationPageFooter} .btn-secondary`,
  approveButton: `${confirmationPageFooter} .btn-primary`,
};

module.exports.confirmationPageElements = {
  confirmationPage,
  footer,
};
