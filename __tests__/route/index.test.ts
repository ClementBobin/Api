import request from 'supertest';
import { app, Request, Response } from '../../src/lib/express.ts';
import router from '../../src/routes/index.ts';

app.use('/', router);

jest.mock('../../src/controllers/userController.ts', () => ({
    getUsers: (req: Request, res: Response) => res.status(200).json([{ id: 1, name: 'John Doe' }]),
}));

describe('GET /users', () => {
    it('should return a list of users', async () => {
        const response = await request(app).get('/users');
        expect(response.status).toBe(200);
        expect(response.body).toEqual([{ id: 1, name: 'John Doe' }]);
    });
});
