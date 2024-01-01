import request from 'supertest';
import { describe, it, afterEach } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import app from '../src/index';
import { HTTP_STATUS } from '../src/constants';
// import Battery from '../src/models/batteryModel';

describe('getBatteries', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('should return batteries with the correct filters', async () => {
        const mockBatteries = [
            { name: 'Battery1', capacity: 100, postalCode: 12345 },
            { name: 'Battery2', capacity: 205, postalCode: 23456 },
        ];

        sinon.spy(mongoose.Query.prototype, 'sort');
        const execStub = sinon.stub(mongoose.Query.prototype, 'exec');

        execStub.callsFake(function() {
            return Promise.resolve(mockBatteries);
        });

        const response = await request(app)
            .get('/batteries')
            .query({ pc_start: '12345', pc_end: '23456', gte_cap: '100', lte_cap: '200' });

        expect(response.status).to.equal(HTTP_STATUS.OK);
        expect(response.body.batteries).to.deep.equal(mockBatteries);
        expect(response.body.totalWattCapacity).to.equal(305);
        expect(response.body.averageWattCapacity).to.equal(152.5);
    });

    it('should handle invalid pc_start filters', async () => {
        const response = await request(app)
            .get('/batteries')
            .query({ pc_start: '1abc'});

        expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.message).to.equal('Invalid filter value for pc_start');
    });

    it('should handle invalid pc_end filter', async () => {
        const response = await request(app)
            .get('/batteries')
            .query({ pc_end: '1abc'});
        
        expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.message).to.equal('Invalid filter value for pc_end');
    });

    it('should handle invalid gte_cap filter', async () => {
        const response = await request(app)
            .get('/batteries')
            .query({ gte_cap: '1abc'});
        
        expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.message).to.equal('Invalid filter value for gte_cap');
    });

    it('should handle invalid lte_cap filter', async () => {
        const response = await request(app)
            .get('/batteries')
            .query({ lte_cap: '1abc'});
        

        expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.message).to.equal('Invalid filter value for lte_cap');
    });
});


describe('createBatteries', () => {
    it('should handle invalid battery info', async () => {

        const response = await request(app)
            .post('/batteries')
            .send([{ name: 'Battery1', capacity: 'abc', postalCode: 90001 }]);

        console.log(response.body.details[0].path);

        expect(response.status).to.equal(HTTP_STATUS.BAD_REQUEST);
        expect(response.body.details[0].message).to.equal('"[0].capacity" must be a number');
    });
});
