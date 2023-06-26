const request = require("supertest");
const { app } = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const fs = require('fs/promises');

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe('GET/api/topics', () => {
  test('200: responds with an array of topic objects, each of which should have the properties of slug and description', () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const { topics } = body
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String))
          expect(topic).toHaveProperty("description", expect.any(String))
        });
      });
  });
});

describe('GET/api/', () => {
  test('200: responds with an object describing all the available endpoints', () => {

    return request(app)
      .get('/api/')
      .expect(200)
      .then(({ body }) => {
        const actualEndpoints = require('../endpoints.json');
        const { endpoints } = body;
        expect(endpoints).toEqual(actualEndpoints);
      });
  });
});