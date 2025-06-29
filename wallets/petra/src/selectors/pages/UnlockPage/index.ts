import { createNameSelector } from '../../createNameSelector'

export default {
  passwordInput: createNameSelector('password'),
  submitButton: 'button:has-text("Unlock")'
}
