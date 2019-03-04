const express = require('express')
const mongoose = require('mongoose')
const dbConfig = require('./config/database')

class App {
  constructor() {
    this.express = express()
    this.isDev = process.env.NODE_ENV === 'production'

    this.database()
    this.middlewares()
    this.routes()
  }

  middlewares() {
    this.express.use(express.json())
  }

  routes() {
    this.express.use(require('./routes'))
  }

  database() {
    mongoose.connect(dbConfig.uri, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
  }
}

module.exports = new App().express
