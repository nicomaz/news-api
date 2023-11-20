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
