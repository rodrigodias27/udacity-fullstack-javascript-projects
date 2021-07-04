import supertest from 'supertest';
import app from '../index';

const request = supertest(app);
describe('Test endpoint responses', () => {
  it('gets the api/images with correct params', async (done) => {
    const response = await request.get('/api/images?image=fjord&width=200&height=500');
    expect(response.status).toBe(200);
    done();
  });

  it('gets the api/images without params', async (done) => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
    done();
  });

  it('gets the api/images with an image that doesnt exists', async (done) => {
    const response = await request.get('/api/images?image=noExistingImage&width=200&height=500');
    expect(response.status).toBe(404);
    done();
  });
});
