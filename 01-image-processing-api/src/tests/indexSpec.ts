import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test endpoint responses', () => {
  it('expect gets the api/images with correct params return 200', async (done) => {
    const response = await request.get('/api/images?image=fjord&width=200&height=500');
    expect(response.status).toBe(200);
    done();
  });

  it('expect gets the api/images without params return 400', async (done) => {
    const response = await request.get('/api/images');
    expect(response.status).toBe(400);
    done();
  });

  it('expect the api/images with an image that doesnt exists on project return 404', async (done) => {
    const response = await request.get('/api/images?image=noExistingImage&width=200&height=500');
    expect(response.status).toBe(404);
    done();
  });
});
