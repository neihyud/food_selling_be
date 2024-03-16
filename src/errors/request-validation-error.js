const { CustomError } = require('./custom-error')

class RequestValidationError extends CustomError {
  statusCode = 400

  /**
   * @param {ValidationError[]} errors
   */
  constructor (errors) {
    super('Invalid request parameters')
    this.errors = errors
    Object.setPrototypeOf(this, RequestValidationError.prototype)
  }

  serializeErrors () {
    return this.errors.map((err) => {
      if (err.type === 'field') {
        return { message: err.msg, field: err.path }
      }
      return { message: err.msg }
    })
  }
}

module.exports = { RequestValidationError }
