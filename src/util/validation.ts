function isEmpty(value: string | null | undefined): boolean {
  return !value || value.trim() === ''
}

function userCredentialsAreValid(email: string, password: string): boolean {
  return email.includes('@') && password.trim().length >= 6
}

function userDetailsAreValid(
  email: string,
  password: string,
  name: string,
  address: {
    street: string,
    postal: string,
    city: string
  }
): boolean {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(name) &&
    !isEmpty(address.street) &&
    !isEmpty(address.postal) &&
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
