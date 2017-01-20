'use strict';
const _ = require('underscore');

class Service {
    constructor() {
        this._dataDAO = null;
    }

    queryData(dataSourceID, startTimestamp, endTimestamp, traceContext, callback) {
        if (!dataSourceID || !startTimestamp || !endTimestamp) {
            callback(null, null);
            return;
        }
        this._dataDAO.getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, traceContext, (err, resultJSON) => {
            if (err) {
                callback(err);
            }
            callback(null, resultJSON);
        });
    }
}

module.exports = Service;