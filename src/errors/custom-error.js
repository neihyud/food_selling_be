class CustomError extends Error {
  constructor (message) {
    super(message)
    if (this.constructor === CustomError) {
      throw new Error("Abstract classes can't be instantiated.")
    }
    Object.setPrototypeOf(this, CustomError.prototype)
  }

  serializeErrors () {
    throw new Error("Method 'serializeErrors' must be implement")
  }
}

module.exports = { CustomError }
