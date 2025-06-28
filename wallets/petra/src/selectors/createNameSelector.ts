type FieldName = 'initialPassword' | 'confirmPassword' | 'termsOfService' | `mnemonic-${string}` | (string & {})

export const createNameSelector = (fieldName: FieldName) => {
  if (fieldName === '') {
    throw new Error('[createNameSelector] name cannot be empty')
  }

  return `[name="${fieldName}"]`
}
