const _ = require('underscore');
const co = require('co');
const should = require('should');
const request = require('supertest');
const express = require('express');
const dataRouter = require('../../../lib/express/routes/data');
const {expressZipkinMiddleware, createZipkinTracer} = require("gridvo-common-js");

describe('dataRouter use case test', () => {
    let app;
    let server;
    before(done => {
        function setupExpress() {
            return new Promise((resolve, reject) => {
                app = express();
                app.use(expressZipkinMiddleware({
                    tracer: createZipkinTracer({}),
                    serviceName: 'test-service'
                }));
                app.use('/datas', dataRouter);
                let mockDataQueryService = {};
                mockDataQueryService.queryData = function (queryOpt, traceContext, callback) {
                    if (!queryOpt || !queryOpt.dataSourceID || !queryOpt.startTimestamp || !queryOpt.endTimestamp) {
                        callback(null, null);
                        return;
                    }
                    if (queryOpt.dataSourceID == "station-datatype-other") {
                        callback(null, {
                            dataSource: "station-datatype-other",
                            startTimestamp: 1,
                            endTimestamp: 2,
                            datas: [{v: 100, t: 2},
                                {v: 100, t: 3}]
                        });
                    } else {
                        callback(null, null);
                    }
                }
                app.set('dataQueryService', mockDataQueryService);
                server = app.listen(3001, err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* setup() {
            yield setupExpress();
        };
        co(setup).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
    describe('#get:/datas/:dataSourcrID?startTimestamp=&endTimestamp=&timespan=', () => {
        context('get data source datas', () => {
            it('should response fail if no this data source', done => {
                request(server)
                    .get(`/datas/no-station-datatype-other?startTimestamp=1&endTimestamp=2&timespan=60000`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(400);
                        res.body.errmsg.should.be.eql("fail");
                        done();
                    });
            });
            it('should response fail if no startTimestamp or endTimestamp', done => {
                request(server)
                    .get(`/datas/station-datatype-other`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(400);
                        res.body.errmsg.should.be.eql("fail");
                        done();
                    });
            });
            it('should response ok', done => {
                request(server)
                    .get(`/datas/station-datatype-other?startTimestamp=1&endTimestamp=2&timespan=60000`)
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((err, res) => {
                        if (err) {
                            done(err);
                            return;
                        }
                        res.body.errcode.should.be.eql(0);
                        res.body.errmsg.should.be.eql("ok");
                        res.body.result.dataSource.should.be.eql("station-datatype-other");
                        done();
                    });
            });
        });
    });
    after(done => {
        function teardownExpress() {
            return new Promise((resolve, reject) => {
                server.close(err => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        };
        function* teardown() {
            yield teardownExpress();
        };
        co(teardown).then(() => {
            done();
        }).catch(err => {
            done(err);
        });
    });
});