export const createDataTestSelector = (dataTestId: string) => {
  if (dataTestId.includes(' ')) {
    throw new Error('[CreateDataTestSelector] dataTestId cannot contain spaces')
  }

  return `[data-testid="${dataTestId}"]`
}
