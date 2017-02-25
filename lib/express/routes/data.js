'use strict';
const _ = require('underscore');
const express = require('express');
const {errCodeTable} = require('../util');
const {expressWithZipkinTraceContextFeach:traceContextFeach} = require("gridvo-common-js");
const {logger} = require('../../util');

let router = express.Router();
router.get("/:dataSourceID", (req, res) => {
    let traceContext = traceContextFeach(req);
    let dataSourceID = req.params.dataSourceID;
    let {startTimestamp, endTimestamp, timespan = 60000} = req.query;
    let resultJSON = {};
    if (!dataSourceID || !startTimestamp || !endTimestamp) {
        resultJSON.errcode = errCodeTable.FAIL.errCode;
        resultJSON.errmsg = errCodeTable.FAIL.errMsg;
        res.json(resultJSON);
        logger.error(`query data source ${dataSourceID} fail`, traceContext);
        return;
    }
    let dataQueryService = req.app.get('dataQueryService');
    let queryOpt = {dataSourceID, startTimestamp, endTimestamp, timespan};
    dataQueryService.queryData(queryOpt, traceContext, (err, datasJSON) => {
        if (err) {
            logger.error(err.message, traceContext);
            return;
        }
        if (!datasJSON) {
            resultJSON.errcode = errCodeTable.FAIL.errCode;
            resultJSON.errmsg = errCodeTable.FAIL.errMsg;
            res.json(resultJSON);
            logger.error(`no this data source ${dataSourceID}`, traceContext);
            return;
        }
        resultJSON.errcode = errCodeTable.OK.errCode;
        resultJSON.errmsg = errCodeTable.OK.errMsg;
        resultJSON.result = datasJSON;
        res.json(resultJSON);
        logger.info(`query data source ${dataSourceID} success`, traceContext);
    });
});

module.exports = router;