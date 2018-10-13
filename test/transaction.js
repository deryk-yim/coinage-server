const expect = require('chai').expect;
const app = require('../app');
const request = require("supertest");

const should = require('should');

describe('Testing Transaction Functions', () => {

    describe('POST / transaction / pid', () => {

        context('The transactions do exist', () => {
            it('it will respond with a 200 code', (done) => {
                const id = '5aa43585955a2561e0935cdb';
                request(app)
                    .post('/transaction/' + id)
                    .set('Content-Type', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });

        context('No transactions exist', () => {
            it('it will respond with a 404 code', (done) => {
                const id = '5aa4362f1df0a93f20704e83';
                request(app)
                    .post('/transaction/' + id)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
    });

    describe('POST / transaction / pid/ id', () => {

        context('The specific transaction does exist', () => {
            it('it will respond with a 200 code', (done) => {
                const pid = '5aa43585955a2561e0935cdb';
                const id = '5ac8615a3e351c3dccba5454';
                request(app)
                    .post('/transaction/' + pid + '/' + id)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });

        context('No transactions exist', () => {
            it('it will respond with a 404 code', (done) => {
                const pid = '5aa4362f1df0a93f20704e83';
                const id = '5ac8615a3e351c3dccba5454';
                request(app)
                    .post('/transaction/' + pid + '/' + id)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
    });


    describe('PUT / update / pid / id', () => {
        context('Transaction has Updated multiple Fields', () => {
            it('it will respond with a 200', (done) => {
                const data = {
                    _id: "5ac8615a3e351c3dccba5466",
                    _pid: "5aa43585955a2561e0935cdb",
                    description: "xxxxxxxxxxxxxxxxxxxxxxx",
                    amount: 14.99,
                    currency: '¥'
                }
                request(app)
                    .put('/transaction/update/5aa43585955a2561e0935cdb/5ac8615a3e351c3dccba5466')
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);
        });
    });

    describe('DELETE / 1 / pid / id', () => {
        context('Delete a Transaction', () => {
            it('it will respond with a 200 ', (done) => {
                request(app)
                    .delete('/transaction/delete/5aa43585955a2561e0935cdb/5ac8615a3e351c3dccba5464')
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);

            context('Delete a Transaction that does not exist', () => {
                it('it will respond with 200 and return null if record does not already exist', (done) => {
                    request(app)
                        .delete('/transaction/delete/5aa43585955a2561e0935cdb/5ac8615a3e351c3dccba5410')
                        .set('Accept', 'application/json')
                        .expect(200)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(res.text).to.equal('{}');
                            done();
                        });
                }).timeout(2000);
            });
        });
    });

    describe('POST / transaction / create / 1 / pid', () => {
        context('Create a Transaction and Insert into Bill', () => {
            it('it will respond with a 201 code', (done) => {
                const data = {
                    id: "5ac8615a3e351c3dccba5401",
                    bid: "5ac8615a3e351c3dccba5412",
                    isBill: true,
                    isIncome: false,
                    isLifeExpense: false,
                    pid: "5aa43585955a2561e0935cdb",
                    description: "11 transaction",
                    amount: 10000454540.00,
                    currency: "$",
                    category: "5ab9de687fa8cebf1e3c44e6",
                    createdDate: "2018-04-07T06:12:42.360Z",
                    modifiedDate: "2018-04-07T06:12:42.360Z"
                }
                request(app)
                    .post('/transaction/create/1/5aa43585955a2561e0935cdb')
                    .send(data)
                    .set('Accept', 'application/json')
                    .expect(200)
                    .end(function (err, res) {
                        if (err) return done(err);
                        done();
                    });
            }).timeout(2000);

            context('Create a Transaction and Insert into Bill And Fail without b_id', () => {
                it('it will respond with a 404 code', (done) => {
                    const data = {
                        _id: "5ac8615a3e351c3dccba5480",
                        isBill: true,
                        isIncome: false,
                        isLifeExpense: false,
                        _pid: "5aa43585955a2561e0935cdb",
                        description: "11 transaction",
                        amount: 10000454540.00,
                        currency: "$",
                        category: "5ab9de687fa8cebf1e3c44e6",
                        createdDate: "2018-04-07T06:12:42.360Z",
                        modifiedDate: "2018-04-07T06:12:42.360Z"
                    }
                    request(app)
                        .post('/transaction/create/1/5aa43585955a2561e0935cdb')
                        .send(data)
                        .set('Accept', 'application/json')
                        .expect(404)
                        .end(function (err, res) {
                            if (err) return done(err);
                            done();
                        });
                }).timeout(2000);
            });
        });


        describe('POST / transaction / create / 1 / pid', () => {
            context('Create a Transaction That Already exists', () => {
                it('it will respond with a 404 code', (done) => {
                    const data = {
                        _id: "5ac8615a3e351c3dccba5473",
                        _bid: "5aa43585955a2561e0935cdb",
                        isBill: true,
                        isIncome: false,
                        isLifeExpense: false,
                        _pid: "5aa43585955a2561e0935cdb",
                        description: "11 transaction",
                        amount: "10000454540.00",
                        currency: "$",
                        category: "5ab9de687fa8cebf1e3c44e6",
                        createdDate: "2018-04-07T06:12:42.360Z",
                        modifiedDate: "2018-04-07T06:12:42.360Z"
                    }
                    request(app)
                        .post('/transaction/create/1/5aa43585955a2561e0935cdb')
                        .send(data)
                        .set('Accept', 'application/json')
                        .expect(404)
                        .end(function (err, res) {
                            if (err) return done(err);
                            done();
                        });
                }).timeout(2000);
            });
        });
    });

});     
