const fieldsConfig = {
  username: {
    validates: [
      (value) => {
        if (value) {
          return ''
        }

        return 'Username is required'
      }
    ]
  },
  password: {
    validates: [
      (value) => {
        const alphabeticRegExp = /(?=.*?[a-zA-Z])/
        const digitsRegExp = /(?=.*?[0-9])/
        const minLengthRegExp = /.{7,}/
        const alphabeticPassword = alphabeticRegExp.test(value)
        const digitsPassword = digitsRegExp.test(value)
        const minLengthPassword = minLengthRegExp.test(value)
        if (!alphabeticPassword ||
          !digitsPassword ||
          !minLengthPassword
        ) {
          return 'Password invalid'
        }

        return ''
      }
    ]
  }
}

const validateField = (field, value, object) => {
  let errorMessage = ''

  for (const validateFunction of fieldsConfig[field].validates) {
    errorMessage = validateFunction(value, object)
    if (errorMessage) {
      break
    }
  }

  return errorMessage
}

const AuthService = {
  validateInputAuth (object) {
    const errors = {}

    Object.keys(fieldsConfig).forEach((field) => {
      const errorMessage = validateField(field, object[field], object)
      if (errorMessage) {
        errors[field] = errorMessage
      }
    })

    return errors
  }
}

module.exports = AuthService
