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
describe('POST /api/articles/:article_id/comments', () => {
  const testComment = {
    username: 'lurker',
    body: 'That is a fab article!'
  }
  test('201: takes an object with properties of "username" and "body", responds with an added object', () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { postedComment } = body
        expect(postedComment).toMatchObject({
          comment_id: 19,
          body: 'That is a fab article!',
          article_id: 1,
          author: 'lurker',
          votes: 0,
        });
      });
  });

  describe('Sad paths...', () => {
    test('400: throws "Bad request" if "article_id" is NaN', () => {
      return request(app)
      .post('/api/articles/NaN/comments')
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe('Bad request');
      });
    });
    describe('Invalid inputs...', () => {
      test('400: "Bad request" if invalid object: does not have all required properties', () => {
        const invalidComment = {
          blahblah: 'lurker',
          body: 'That is a fab article!'
        }
        return request(app)
        .post('/api/articles/1/comments')
        .send(invalidComment)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
      });
      test('400: "Bad request" if invalid object: less than 2 properties', () => {
        const invalidComment = {
          body: 'That is a fab article!'
        }
        return request(app)
          .post('/api/articles/1/comments')
          .send(invalidComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
      test('400: "Bad request" if invalid data types in the obj', () => {
        const invalidComment = {
          username: 'lurker',
          body: []
        }
        return request(app)
          .post('/api/articles/1/comments')
          .send(invalidComment)
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Bad request');
          });
      });
      test('404: "Not found" if author is valid but does not exist', () => {
        const invalidComment = {
          username: 'slava',
          body: 'That is a fab article!'
        }
        return request(app)
          .post('/api/articles/1/comments')
          .send(invalidComment)
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Not found');
          });
      });
      test('201: ignores extra properties', () => {
        const extraPropComment = {
          username: 'lurker',
          length: 22,
          body: 'That is a fab article!'
        }
        return request(app)
          .post('/api/articles/1/comments')
          .send(extraPropComment)
          .expect(201)
          .then(({ body }) => {
            const { postedComment } = body;
            expect(postedComment).toMatchObject({
              comment_id: 19,
              body: 'That is a fab article!',
              article_id: 1,
              author: 'lurker',
              votes: 0,
            });
          });
      });
    });
    test('404: responds with "Not found" when valid article_id but does not exist', () => {
      return request(app)
      .post('/api/articles/1243/comments')
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe('Not found');
      });
    });
  });
});