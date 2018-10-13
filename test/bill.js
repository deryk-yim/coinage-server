const expect = require('chai').expect;
const app = require('../app');
const request = require("supertest");

const should = require('should');

describe('Testing Bill Functions', () => {

    describe('POST / bill / pid', () => {
        context('The bills of pid do exist', () => {
            it('it will respond with a 200 code', (done) => {
                const id = '5aa43585955a2561e0935cdb';
                request(app)
                    .post('/bill/' + id)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
        context('The bills of pid do not exist', () => {
            it('it will respond with a 200 code', (done) => {
                const id = '5aa43585955a2561e0935cdc';
                request(app)
                    .post('/bill/' + id)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
    });

    describe('POST / pid / id', () => {
        context('The bill does exist', () => {
            it('it will respond with a 200 code', (done) => {
                const pid = '5aa43585955a2561e0935cdb';
                const id = '5ae5fd8b734d1d13318356cf';
                request(app)
                    .post('/bill/' + pid + '/' + id)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
        context('The bill does not exist', () => {
            it('it will respond with a 200 code', (done) => {
                const pid = '5aa43585955a2561e0935cdc';
                const id = '5ae5fd8b734d1d13318358cf';
                request(app)
                    .post('/bill/' + pid + '/' + id)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
    });

    describe('POST / create / 1 / pid', () => {
        context('Create a bill successfully', () => {
            it('it will respond with a 201 code', (done) => {
                const data = {
                    _id: "5ac8615a3e351c3dccba5490",
                    isBiweekly: true,
                    isIncome: false,
                    _pid: "5aa43585955a2561e0935cdb",
                    description: "Bill 1",
                    category: "5ab9de687fa8cebf1e3c44e6",
                    recurringDate: "2018-04-07T06:12:42.360Z"
                }
                request(app)
                    .post('/bill/create/1/' + data._pid)
                    .send(data)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(201)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
    });

    describe('DELETE / ', () => {
        context('Delete Bill successfully', () => {

            it('it will respond with a 200 code', (done) => {
                const pid = '5aa43585955a2561e0935cdb';
                const id = '5ac8615a3e351c3dccba5490';
                request(app)
                    .delete('/bill/delete/1/' + pid + '/' + id)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);;
        })
    });
});

