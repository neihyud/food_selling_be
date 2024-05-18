const { NotAuthorizedError } = require('../errors/not-authorized-error')

const verifyStaffAndAdmin = async (req, res, next) => {
  const user = req.user

  if (user.role !== 'admin' && user.role !== 'staff') {
    throw new NotAuthorizedError()
  }

  next()
}

module.exports = { verifyStaffAndAdmin }
