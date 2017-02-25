'use strict';
const _ = require('underscore');
const should = require('should');
const muk = require('muk');
const DataQueryService = require('../../../lib/application/service/dataQueryService');

describe('DataQueryService use case test', () => {
    let service;
    before(() => {
        service = new DataQueryService();
    });
    describe('#queryData(queryOpt, traceContext, callback)', () => {
        context('query data', () => {
            it('if no "dataSourceID startTimestamp endTimestamp",is fail', done => {
                service.queryData({}, {}, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    _.isNull(resultJSON).should.be.eql(true);
                    done();
                });
            });
            it('if no this data source,is return null', done => {
                let mockDataDAO = {};
                mockDataDAO.getDatasByDataSourceID = (queryOpt, traceContext, callback) => {
                    callback(null, null);
                };
                muk(service, "_dataDAO", mockDataDAO);
                let queryOpt = {
                    dataSourceID: "no-data-source",
                    startTimestamp: 0,
                    endTimestamp: 1
                };
                service.queryData(queryOpt, {}, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    _.isNull(resultJSON).should.be.eql(true);
                    done();
                });
            });
            it('return resultJSON', done => {
                let mockDataDAO = {};
                mockDataDAO.getDatasByDataSourceID = (dataSourceID, startTimestamp, endTimestamp, traceContext, callback) => {
                    callback(null, {
                        dataSource: "station-datatype-other",
                        startTimestamp: 1,
                        endTimestamp: 2,
                        datas: [{v: 100, t: 2},
                            {v: 100, t: 3}]
                    });
                };
                muk(service, "_dataDAO", mockDataDAO);
                let queryOpt = {
                    dataSourceID: "station-datatype-other",
                    startTimestamp: 1,
                    endTimestamp: 2
                };
                service.queryData(queryOpt, {}, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    resultJSON.dataSource.should.be.eql("station-datatype-other");
                    resultJSON.startTimestamp.should.be.eql(1);
                    resultJSON.endTimestamp.should.be.eql(2);
                    resultJSON.datas.length.should.be.eql(2);
                    done();
                });
            });
        });
    });
    after(() => {
        muk.restore();
    });
});