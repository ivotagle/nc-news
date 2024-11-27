const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: returns and array with all topics.", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.topics)).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: returns and array with all the articles, sorted by descending creation date and new comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((article) => {
          expect(Object.keys(article)).toHaveLength(8);
          expect(article).toMatchObject({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
            article_img_url: expect.any(String),
          });
        });
        expect(body).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: returns and array with the selected article.", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(Object.keys(body.article)).toHaveLength(8);
        expect(body.article).toMatchObject({
          article_id: 1,
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("400: if article_id is not a Number, returns invalid format", () => {
    return request(app)
      .get("/api/articles/curtains")
      .expect(400)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Bad request: invalid format" });
      });
  });

  test("404: if article_id is a number, but it does not exist in the DB", () => {
    return request(app)
      .get("/api/articles/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({ msg: "Article 9999 not found" });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: This will get all comments from an specific article", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThan(0);
        body.forEach((comment) => {
          expect(Object.keys(comment)).toHaveLength(6);
          expect(comment).toMatchObject({
            article_id: 1,
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            author: expect.any(String),
            created_at: expect.any(String),
            body: expect.any(String),
          });
        });
        expect(body).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("POST 201 adding successfully a comment for an article", () => {
    const newComment = {
      username: "icellusedkars",
      body: "The path of the righteous man is beset on all sides by the inequities of the selfish and the tyranny of evil men...",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const postedComment = body.newComment[0];
        expect(postedComment).toMatchObject({
          article_id: 1,
          comment_id: expect.any(Number),
          author: expect.any(String),
          created_at: expect.any(String),
          body: expect.any(String),
        });
      });
  });
});

describe("GET Generic Errors", () => {
  test("404: Responds with an error when the endpoint does not exist", () => {
    return request(app)
      .get("/invalid-endpoint")
      .expect(404)
      .then(({ body }) => {
        expect(body).toEqual({
          msg: "Not Found",
        });
      });
  });
});
