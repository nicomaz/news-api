const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const {
  articleData,
  commentData,
  topicData,
  userData,
} = require("../db/data/test-data/index");
const { isObject } = require("../db/seeds/utils");

beforeEach(() => seed({ articleData, commentData, topicData, userData }));
afterAll(() => db.end());

describe("GET /api/topics", () => {
  it("200: responds with an array of all topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: { topics } }) => {
        const expectedTopic = {
          slug: expect.any(String),
          description: expect.any(String),
        };

        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject(expectedTopic);
        });
      });
  });
});

describe("GET /api", () => {
  it("200: responds with an object of available endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        const expectedEndpoint = {
          description: expect.any(String),
          queries: expect.any(Array),
        };

        for (let endpoint in endpoints) {
          const endPointBody = endpoints[endpoint];
          expect(endPointBody).toMatchObject(expectedEndpoint);
          expect(isObject(endPointBody.exampleResponse)).toBe(true);

          if (endPointBody.exampleRequest) {
            expect(isObject(endPointBody.exampleRequest)).toBe(true);
          }
        }
      });
  });
});

describe("GET /api/articles", () => {
  it("200: responds with an array of all articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        const expectedArticle = {
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
          comment_count: expect.any(String),
        };

        expect(articles.length).toBe(13);
        articles.forEach((article) => {
          expect(article).toMatchObject(expectedArticle);
        });
      });
  });
  it("200: responds with correct comment_count", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        const article1 = articles.filter((article) => {
          if (article.article_id === 1) {
            return article;
          }
        });
        expect(+article1[0].comment_count).toBe(11);
      });
  });
});  
it("200: articles should be sorted in descending order", () => {
  return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: { articles } }) => {
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
});

describe("ANY /notAPath", () => {
  test("404: responds with an error message if path is not found", () => {
    return request(app)
      .get("/notAPath")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });
});
