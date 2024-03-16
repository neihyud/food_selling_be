const express = require('express')
require('express-async-errors')
const { NotFoundError } = require('./src/errors/not-found-error')
const { errorHandler } = require('./src/middlewares/error-handler')
const { port } = require('./src/config/index')
const route = require('./src/routers')

const app = express()

const cors = require('cors')
app.use(cors())
app.use(express.json())

const mongodb = require('./src/connections/mongodb')
mongodb.connect()

app.use('/', route)

app.all('*', async (req, res) => {
  throw new NotFoundError()
})

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})
