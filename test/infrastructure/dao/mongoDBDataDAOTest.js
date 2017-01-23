'use strict';
const MongoClient = require('mongodb').MongoClient;
const _ = require('underscore');
const should = require('should');
const mongoDBDataDAO = require('../../../lib/infrastructure/dao/mongoDBDataDAO');

describe('mongoDBDataDAO use case test', () => {
    let DAO;
    before(() => {
        DAO = new mongoDBDataDAO();
    });
    describe('#getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, traceContext, callback)', () => {
        context('get data source datas from startTimestamp to endTimestamp', () => {
            it('should return null if no this data source', done => {
                let dataSourceID = "station-datatype-other";
                let endTimestamp = (new Date()).getTime();
                let startTimestamp = endTimestamp - 600 * 1000;
                DAO.getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, {}, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    _.isNull(resultJSON).should.be.eql(true);
                    done();
                });
            });
        });
    });
    describe('#getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, traceContext, callback)', () => {
        context('get data source datas from startTimestamp to endTimestamp', () => {
            let dataSourceID = "station-datatype-other";
            let endTimestamp = (new Date()).getTime();
            let startTimestamp = endTimestamp - 600 * 1000;
            before(done => {
                let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
                MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Data`, (err, db) => {
                    if (err) {
                        done(err);
                    }
                    let t = new Date(startTimestamp + 60 * 1000);
                    let v = 100;
                    db.collection('station-datatype-other').updateOne({t},
                        {$set: {v}},
                        {upsert: true},
                        (err, result) => {
                            if (err) {
                                done(err);
                            }
                            db.close();
                            done();
                        });
                });
            });
            it('should return datas', done => {
                DAO.getDatasByDataSourceID(dataSourceID, startTimestamp, endTimestamp, {}, (err, resultJSON) => {
                    if (err) {
                        done(err);
                    }
                    _.isNull(resultJSON).should.be.eql(false);
                    resultJSON.dataSource.should.be.eql("station-datatype-other");
                    resultJSON.startTimestamp.should.be.eql(startTimestamp);
                    resultJSON.endTimestamp.should.be.eql(endTimestamp);
                    resultJSON.datas.length.should.be.eql(1);
                    done();
                });
            });
        });
    });
    after(done => {
        let {MONGODB_SERVICE_HOST = "127.0.0.1", MONGODB_SERVICE_PORT = "27017"}= process.env;
        MongoClient.connect(`mongodb://${MONGODB_SERVICE_HOST}:${MONGODB_SERVICE_PORT}/Data`, (err, db) => {
            if (err) {
                done(err);
            }
            db.collection('station-datatype-other').drop((err, response) => {
                if (err) {
                    done(err);
                }
                db.close();
                done();
            });
        });
    });
});