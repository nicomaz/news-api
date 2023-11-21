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
  it("endpoint.json contains api/topics/", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/topics");
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
  it("endpoint.json contains api/articles/:articles_id", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
      });
  });
});

describe("GET /api/articles/:articles_id", () => {
  it("200: responds with individual article", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body: { article } }) => {
        const expectedArticle = {
          author: "icellusedkars",
          title: "Sony Vaio; or, The Laptop",
          article_id: 2,
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expect(article).toMatchObject(expectedArticle);
      });
  });
  it("400: responds with an error message if id is not a valid type", () => {
    return request(app)
      .get("/api/articles/article3")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("404: responds with an error message if id is a valid type but does not exist", () => {
    return request(app)
      .get("/api/articles/15")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  it("200: responds with an array of comments of given article_id", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        const expectedComment = {
          body: expect.any(String),
          votes: expect.any(Number),
          author: expect.any(String),
          article_id: 3,
          created_at: expect.any(String),
        };

        expect(comments.length).toBe(2);
        comments.forEach((comment) => {
          expect(comment).toMatchObject(expectedComment);
        });
      });
  });
  it("200: responds with most recent comments first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("400: responds with an error message if id is not a valid type", () => {
    return request(app)
      .get("/api/articles/article3/comments")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("404: responds with an error message if id is a valid type but does not exist", () => {
    return request(app)
      .get("/api/articles/15/comments")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  it("200: responds with an empty array if article id exists but has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments).toEqual([]);
      });
  });
  it("endpoint.json contains /api/articles/:article_id/comments", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty(
          "GET /api/articles/:article_id/comments"
        );
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
          expect(article.body).toBe(undefined);
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
  it("200: articles should be sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  it("endpoint.json contains api/articles/", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/articles");
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
