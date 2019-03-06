const express = require('express')
const mongoose = require('mongoose')
const validate = require('express-validation')
const Youch = require('youch')
const dbConfig = require('./config/database')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV === 'production'

    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  middlewares() {
    this.express.use(express.json())
  }

  routes() {
    this.express.use(require('./routes'))
  }

  exception() {
    this.express.use(async (err, req, res, next) => {
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res
        .status(err.status || 500)
        .json({
          error: 'Internal server error'
        })
    })
  }

  database() {
    mongoose.connect(dbConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }
}

module.exports = new App().express
