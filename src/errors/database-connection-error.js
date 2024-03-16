const { CustomError } = require('./custom-error')

class DatabaseConnectionError extends CustomError {
  statusCode = 500
  reason = 'Error connecting to database'

  constructor (message) {
    super('Error connecting to db')
    this.reason = message
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
  }

  serializeErrors () {
    return [{ message: this.reason }]
  }
}

module.exports = { DatabaseConnectionError }
