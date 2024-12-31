import IAddress from '../types';

function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim() === ''
}

function userCredentialsAreValid(email: string, password: string): boolean {
  return email.includes('@') && password.trim().length >= 6
}

function userDetailsAreValid(
  email: string,
  password: string,
  fullname: string,
  address: IAddress
): boolean {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    !isEmpty(address.street) &&
    !isEmpty(address.postalCode) &&
    !isEmpty(address.city)
  )
}

function emailIsConfirmed(email: string, confirmEmail: string): boolean {
  return email === confirmEmail
}

export default {
  userDetailsAreValid,
  emailIsConfirmed
}
