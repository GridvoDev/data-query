'use strict';
const express = require('express');
const {expressZipkinMiddleware} = require("gridvo-common-js");
const {logger, tracer} = require('./lib/util');
const {dataRouter} = require('./lib/express');
const {createDataQueryService} = require('./lib/application');

let app;
app = express();
app.use(expressZipkinMiddleware({
    tracer: tracer,
    serviceName: 'data-query'
}));
app.use('/datas', dataRouter);
let dataQueryService = createDataQueryService();
app.set('dataQueryService', dataQueryService);
app.listen(3001, (err)=> {
    if (err) {
        logger.error(err.message);
    }
    else {
        logger.info("express server is starting");
    }
});