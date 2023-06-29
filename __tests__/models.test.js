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

describe('GET/api/articles/:article_id', () => {
  test('200: responds with a particular article by id provided in the url', () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const { article } = body;
        expect(article).toHaveProperty('article_id', 1);
        expect(article).toHaveProperty('title', expect.any(String));
        expect(article).toHaveProperty('topic', expect.any(String));
        expect(article).toHaveProperty('author', expect.any(String));
        expect(article).toHaveProperty('body', expect.any(String));
        expect(article).toHaveProperty('created_at', expect.any(String));
        expect(article).toHaveProperty('votes', expect.any(Number));
        expect(article).toHaveProperty('article_img_url', expect.any(String));
      });
  });

  test('400: throws "Bad request" error if NaN', () => {
    return request(app)
      .get('/api/articles/NaN')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
  });

  test('404: throws "Not found" when valid id, but does not exist', () => {
    return request(app)
      .get('/api/articles/170')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
});

describe('ALL/wrong_path/, responds with Not found', () => {
  test('404: reponds with "Not found" error when invalid path', () => {
    return request(app)
      .get('/nonsense/')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found')
      });
  });
});

describe('GET/api/articles/:article_id/comments', () => {
  test('200: responds with an array of comments for the given article_id; each object should have correct properties', () => {
    return request(app)
      .get('/api/articles/1/comments')
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(11);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty('comment_id', expect.any(Number));
          expect(comment).toHaveProperty('votes', expect.any(Number));
          expect(comment).toHaveProperty('created_at', expect.any(String));
          expect(comment).toHaveProperty('author', expect.any(String));
          expect(comment).toHaveProperty('body', expect.any(String));
          expect(comment).toHaveProperty('article_id', expect.any(Number));
        });
        expect(comments).toBeSortedBy('created_at', {descending: true});
      });
  });
  test('404: responds with "Not found" if valid article_id, but article does not exist', () => {
    return request(app)
      .get('/api/articles/190/comments')
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
  });
  test('400: responds with "Bad request" when article_id is NaN', () => {
    return request(app)
      .get('/api/articles/NaN/comments')
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request')
      });
  });
});
describe('GET/api/articles', () => {

  test('200: should respond with an object containing all articles', () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles.length).toBe(13)
        articles.forEach((article) => {
          expect(article).toHaveProperty('article_id', expect.any(Number));
          expect(article).toHaveProperty('title', expect.any(String));
          expect(article).toHaveProperty('topic', expect.any(String));
          expect(article).toHaveProperty('author', expect.any(String));
          expect(article).toHaveProperty('created_at', expect.any(String));
          expect(article).not.toHaveProperty('body');
          expect(article).toHaveProperty('votes', expect.any(Number));
          expect(article).toHaveProperty('article_img_url', expect.any(String));
          expect(article).toHaveProperty('comment_count', expect.any(String))
        });
        expect(articles).toBeSortedBy('created_at', { descending: true })
      });
  });
});