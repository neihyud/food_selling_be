const { NotAuthorizedError } = require('../errors/not-authorized-error')

const verifyAdmin = async (req, res, next) => {
  const user = req.user

  if (user.role !== 'admin') {
    throw new NotAuthorizedError()
  }

  next()
}

module.exports = { verifyAdmin }
