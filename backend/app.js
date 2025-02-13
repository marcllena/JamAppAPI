'use strict'
/*
Configuració de express (pk cada cop que es guardi, s'engegi el servidor)
A més indica que utilitzarem la URL api, important el modul creat a rutes
 */

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const api = require('./routes')
const cors= require('cors')
const configParam = require('./configParam')

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin",`http://${configParam.constants().CORS_IP}:8100`);
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
    }
    next()
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use('/api',api)
app.use(cors())
app.options('*',cors())

module.exports = app
