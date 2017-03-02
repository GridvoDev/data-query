'use strict';
const _ = require('underscore');
const {createDataDAO} = require('../../infrastructure');

class Service {
    constructor() {
        this._dataDAO = createDataDAO();
    }

    queryData(queryOpt, traceContext, callback) {
        if (!queryOpt || !queryOpt.dataSourceID || !queryOpt.startTimestamp || !queryOpt.endTimestamp) {
            callback(null, null);
            return;
        }
        let {dataSourceID, startTimestamp, endTimestamp, timespan}=queryOpt;
        this._dataDAO.getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, traceContext, (err, resultJSON) => {
            if (err) {
                callback(err);
            }
            callback(null, resultJSON);
        });
    }
}

module.exports = Service;