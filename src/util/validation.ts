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
  // address: {
    street: string,
    postalCode: string,
    city: string
  // }
): boolean {
  console.log("User Details")
  console.log(email)
  console.log(password)
  console.log(fullname)
  // console.log(address)
  console.log(street)
  console.log(postalCode)
  console.log(city)

  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(fullname) &&
    // !isEmpty(address.street) &&
    // !isEmpty(address.postalCode) &&
    // !isEmpty(address.city)
    !isEmpty(street) &&
    !isEmpty(postalCode) &&
    !isEmpty(city)
  )
}

function emailIsConfirmed(email: string, confirmEmail: string): boolean {
  return email === confirmEmail
}

export default {
  userDetailsAreValid,
  emailIsConfirmed
}
