import request from 'supertest';
import { app } from './server';

describe('API Endpoints', () => {
    it('should return OK for health check', async () => {
        const res = await request(app).get('/health');
        expect(res.statusCode).toEqual(200);
        expect(res.text).toEqual('OK');
    });

    it('should return 404 for unknown endpoint', async () => {
        const res = await request(app).get('/unknown');
        expect(res.statusCode).toEqual(404);
    });

    it('should serve API documentation', async () => {
        const res = await request(app).get('/docs');
        expect(res.statusCode).toEqual(200);
        expect(res.headers['content-type']).toMatch(/html/);
    });
});