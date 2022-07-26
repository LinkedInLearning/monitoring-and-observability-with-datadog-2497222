const _ = require('lodash');
const winston = require('winston');
const logservice = require("../config/logservice");

const consoleLogger = new winston.transports.Console();
const fileLogger = new winston.transports.File({ filename: './combined.log' });

// initialize logger
const nlogger = new winston.createLogger({
    level: 'debug',
    transports: [consoleLogger, fileLogger],
    exitOnError: false,
});

module.exports = {
    nlogger,
    debug: (message) => {
        const payload = {
            service: process.env.SERVICE,
            type: 'debug',
            message: message
        }

        nlogger.log('debug', payload);
    },
    log: (message) => {
        const payload = {
            service: process.env.SERVICE,
            type: 'info',
            message: message
        }

        nlogger.log('info', payload);
    },

    request: (req) => {

        const payload = {
            service: process.env.SERVICE,
            type: 'request',
            endpoint: req.url,
            tag: req.tag,
            payload: {
                verb: req.method,
                client: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress,
                //headers: req.headers,
                query: req.query,
                body: req.body,
            },
        };
        nlogger.log('info', payload);
    },

    error: (req, err) => {

        const startTime = req._startTime;
        const rightNow = new Date();
        const ageSinceRequestStart = rightNow - startTime;
        const payload = {
            service: process.env.SERVICE,
            type: 'error',
            created: startTime,
            age: ageSinceRequestStart,
            endpoint: req.url,
            tag: req.tag,
            payload: {
                verb: req.method,
                client: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress,
                headers: req.headers,
                level: err.type,
                classification: "error" || err.name,
                body: {
                    message: err.message,
                    source: err.name,
                    description: err.stack,
                },
            },
        };
        nlogger.log('info', payload);
    },

    response: (res, status, body) => {

        const startTime = res.req._startTime;
        const rightNow = new Date();
        const ageSinceRequestStart = rightNow - startTime;
        const payload = {
            service: process.env.SERVICE,
            type: 'response',
            created: rightNow,
            age: ageSinceRequestStart,
            endpoint: res.req.url,
            tag: res.req.tag,
            payload: {
                verb: res.req.method,
                client: res.req.headers['x-forwarded-for'] ? res.req.headers['x-forwarded-for'].split(',')[0] : res.req.connection.remoteAddress,
                status,
                body: body,
            },
        };
        nlogger.log('info',payload);
    },

    info: (req, data, classification) => {
        if (!UtilityService.Object.shouldLogObject(data)) {
            return;
        }
        if (!req || !req.tag) {
            const payload = {
                classification: classification || 'response',
                data,
            };
            logservice.log(payload);
            return;
        }

        const startTime = req._startTime;
        const rightNow = new Date();
        const ageSinceRequestStart = rightNow - startTime;
        const payload = {
            service: process.env.SERVICE,
            type: 'info',
            created: startTime,
            age: ageSinceRequestStart,
            endpoint: req.url,
            tag: req.tag,
            payload: {
                verb: req.method,
                client: req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : req.connection.remoteAddress,
                classification,
                body: data,
            },
        };
        nlogger.log('info', payload);
    },

 
};
