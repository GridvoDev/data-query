'use strict';
const _ = require('underscore');
const {createMongoZipkinClient} = require('gridvo-common-js');
const {tracer} = require('../../util');

class DAO {

    constructor() {
        this._dbName = "DataCollect";
        this._serviceName = "data-query";
    }

    getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, traceContext, callback) {
        let mongoClient = createMongoZipkinClient({
            tracer,
            traceContext,
            dbName: this._dbName,
            collectionName: dataSourceID,
            serviceName: this._serviceName
        });

        mongoClient.then(({db, collection}) => {
            let startTime = new Date(startTimestamp);
            let endTime = new Date(endTimestamp);
            collection.aggregate([{
                    $match: {
                        t: {$gte: startTime, $lte: endTime}
                    }
                }, {
                    $project: {
                        "v": 1,
                        "t": 1,
                        "_id": 0
                    }
                }],
                (err, result) => {
                    if (err) {
                        callback(err);
                        db.close();
                        return;
                    }
                    if (result.length == 0) {
                        callback(null, null);
                        db.close();
                        return;
                    }
                    let resultJSON = {
                        dataSource: dataSourceID,
                        startTimestamp,
                        endTimestamp,
                        datas: []
                    }
                    for (let data of result) {
                        data.t = data.t.getTime();
                        resultJSON.datas.push(data);
                    }
                    callback(null, resultJSON);
                    db.close();
                });
        }).catch(err => {
            callback(err);
        });
    }
}


module.exports = DAO;