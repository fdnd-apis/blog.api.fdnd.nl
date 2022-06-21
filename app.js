require('dotenv').config()
const express = require('express')

const indexRoute = require('./routes/index')
const postRoute = require('./routes/post')
const errorRoute = require('./routes/error')

module.exports = express()
  .use(express.json())
  .use(express.urlencoded({ extended: true }))

  .use('/', indexRoute)
  .use('/v1/post', postRoute)
  .use(errorRoute)
