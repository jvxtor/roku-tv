import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/my-ip (GET) returns the connection IP and forwarded-for header', () => {
    return request(app.getHttpServer())
      .get('/my-ip')
      .set('X-Forwarded-For', '177.100.100.100')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toEqual({
          ip: expect.any(String),
          forwardedFor: '177.100.100.100',
        });
      });
  });

  it('/my-ip (GET) falls back to the connection IP when no forwarded-for header exists', () => {
    return request(app.getHttpServer())
      .get('/my-ip')
      .expect(200)
      .expect(({ body }) => {
        expect(body.ip).toEqual(expect.any(String));
        expect(body.forwardedFor).toBe(body.ip);
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
