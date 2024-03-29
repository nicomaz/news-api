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

          if (endPointBody.exampleResponse) {
            expect(isObject(endPointBody.exampleResponse)).toBe(true);
          }

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

describe("GET /api/articles", () => {
  it("200: responds with an array of first 10 articles", () => {
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
          comment_count: expect.any(Number),
        };

        expect(articles.length).toBe(10);
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
        expect(article1[0].comment_count).toBe(11);
      });
  });
  it("200: articles should be sorted in descending order by created_at", () => {
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
  describe("GET api/articles?topic=", () => {
    it("200: responds with an array of first 10 articles specified in a topic query", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          const expectedArticle = {
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: "mitch",
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(Number),
          };

          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toMatchObject(expectedArticle);
          });
        });
    });
    it("200: responds with an array of first 10 articles when topic is not specified", () => {
      return request(app)
        .get("/api/articles?topic=")
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
            comment_count: expect.any(Number),
          };

          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toMatchObject(expectedArticle);
          });
        });
    });
    it("404: responds with error message when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=app")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    it("200: responds with an empty array if queried topic exists but has no articles", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toEqual([]);
        });
    });
    it("endpoint.json contains topic as a query for GET /api/articles", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          const topicQueries = endpoints["GET /api/articles"].queries;
          expect(topicQueries.includes("topic")).toBe(true);
        });
    });
  });
  describe("GET api/articles?sort_by=", () => {
    it("200: responds with an array of first 10 articles sorted by query", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
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
            comment_count: expect.any(Number),
          };

          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toMatchObject(expectedArticle);
          });

          expect(articles).toBeSortedBy("title", { descending: true });
        });
    });
    it("400: responds with an error message for an invalid sort_by query", () => {
      return request(app)
        .get("/api/articles?sort_by=arthor")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("endpoint.json contains sort_by as a query for GET /api/articles", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          const topicQueries = endpoints["GET /api/articles"].queries;
          expect(topicQueries.includes("sort_by")).toBe(true);
        });
    });
  });
  describe("GET api/articles?sort_by &order=", () => {
    it("200: responds with an array of first 10 articles ordered by a combination of queries", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=ASC")
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
            comment_count: expect.any(Number),
          };

          expect(articles.length).toBe(10);
          articles.forEach((article) => {
            expect(article).toMatchObject(expectedArticle);
          });
          expect(articles).toBeSortedBy("author", { descending: false });
        });
    });
    it("400: responds with an error message for an invalid order query", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=AAS")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("endpoint.json contains order as a query for GET /api/articles", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          const topicQueries = endpoints["GET /api/articles"].queries;
          expect(topicQueries.includes("order")).toBe(true);
        });
    });
  });
  describe("GET api/articles?limit=", () => {
    it("200: responds with an array of first 10 articles and total count", () => {
      return request(app)
        .get("/api/articles?limit=")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(articles.length).toBe(10);
          expect(total_count).toBe(13);
        });
    });
    it("400: responds with error message if invalid limit query is passed", () => {
      return request(app)
        .get("/api/articles?limit=one")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("400: responds with error message if valid limit query is a negative", () => {
      return request(app)
        .get("/api/articles?limit=-1")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET api/articles?limit= p=", () => {
    it("200: responds with an array of articles limited by limit query and from the page query", () => {
      return request(app)
        .get("/api/articles?limit=2&p=4")
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(articles.length).toBe(2);
          expect(total_count).toBe(13);
          expect(articles[0].title).toBe(
            "Seven inspirational thought leaders from Manchester UK"
          );
          expect(articles[1].title).toBe("Student SUES Mitch!");
        });
    });
    it("400: responds with error message if there is an invalid page query", () => {
      return request(app)
        .get("/api/articles?limit=2&p=three")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("404: responds with error message if the page query is valid but doesn't exist", () => {
      return request(app)
        .get("/api/articles?limit=2&p=20")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    it("200: accepts a combination of queries", () => {
      return request(app)
        .get(
          "/api/articles?topic=mitch&sort_by=article_id&order=ASC&limit=2&p=1"
        )
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(12);
          expect(articles.length).toBe(2);
          expect(articles).toBeSortedBy("article_id", { descending: false });
          expect(articles[0].title).toBe(
            "Eight pug gifs that remind me of mitch"
          );
          expect(articles[1].title).toBe("Student SUES Mitch!");
        });
    });
    it("endpoint.json contains limit as a query for GET /api/articles", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          const topicQueries = endpoints["GET /api/articles"].queries;
          expect(topicQueries.includes("limit")).toBe(true);
        });
    });
    it("endpoint.json contains p as a query for GET /api/articles", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          const topicQueries = endpoints["GET /api/articles"].queries;
          expect(topicQueries.includes("p")).toBe(true);
        });
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
  it("endpoint.json contains /api/articles/:article_id", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/articles/:article_id");
      });
  });
  it("200: responds with individual article with a comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.comment_count).toBe(11);
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  it("200: responds with article object with updated votes when adding votes", () => {
    const newVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        const expectedArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 101,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };

        expect(article).toMatchObject(expectedArticle);
      });
  });
  it("200: responds with article object with updated votes when removing votes", () => {
    const newVotes = { inc_votes: -1 };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(200)
      .then(({ body: { article } }) => {
        const expectedArticle = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 99,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };

        expect(article).toMatchObject(expectedArticle);
      });
  });
  it("400: responds with an error message if request body is invalid", () => {
    const newVotes = { inc_votes: "update this please" };
    return request(app)
      .patch("/api/articles/1")
      .send(newVotes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("400: responds with an error message if id is not a valid type", () => {
    const newVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/article3")
      .send(newVotes)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("404: responds with an error message if id is a valid type but does not exist", () => {
    const newVotes = { inc_votes: 1 };
    return request(app)
      .patch("/api/articles/15")
      .send(newVotes)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Article not found");
      });
  });
  it("endpoint.json PATCH /api/articles/:article_id", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("PATCH /api/articles/:article_id");
      });
  });
});

describe("POST /api/articles", () => {
  it("201: responds with added article", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "New article",
      body: "This is a new article",
      topic: "cats",
      article_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        const expectedArticle = {
          author: "icellusedkars",
          title: "New article",
          body: "This is a new article",
          topic: "cats",
          article_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          article_id: 14,
          votes: 0,
          created_at: expect.any(String),
          comment_count: 0,
        };

        expect(article).toMatchObject(expectedArticle);
      });
  });
  it("201: responds with add article with default img_url if no img_url is passed", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "New article",
      body: "This is a new article",
      topic: "cats",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_img_url).toBe(
          "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
        );
      });
  });
  it("400: responds with error when request body is invalid", () => {
    const newArticle = {
      author: "icellusedkars",
      title: "New article",
      body: "This is a new article",
      topic: "dog",
      article_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("400: responds with error when request is missing required information", () => {
    const newArticle = {
      author: "icellusedkars",
      body: "This is a new article",
      topic: "dog",
      article_img_url:
        "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
    };
    return request(app)
      .post("/api/articles")
      .send(newArticle)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("endpoint.json contains POST /api/articles", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("POST /api/articles");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  it("204: deletes specific article and sends no body back", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return db.query(`SELECT * FROM comments`);
      })
      .then(({ rows }) => {
        rows.forEach((row) => {
          expect(row.article_id === 1).toBe(false);
        });
      });
  })
  it("400: responds with error message when given an invalid article id", () => {
    return request(app)
    .delete("/api/articles/one")
    .expect(400)
    .then(({ body: { msg } }) => {
      expect(msg).toBe("Bad request")
    })
  })
  it("404: responds with error message when given a valid but non-existent article id", () => {
    return request(app)
    .delete("/api/articles/20")
    .expect(404)
    .then(( { body: { msg } }) => {
      expect(msg).toBe("Not found")
    })
  })
  it("endpoint.json contains DELETE /api/articles/:article_id", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("DELETE /api/articles/:article_id");
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
        expect(msg).toBe("Not found");
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
  describe("GET api/articles:article_id/comments?limit=", () => {
    it("200: responds with an array of comments of an article limited by limit query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=3")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(3);

          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
          });

          expect(comments[0].comment_id).toBe(5);
          expect(comments[1].comment_id).toBe(2);
          expect(comments[2].comment_id).toBe(18);
        });
    });
    it("400: responds with an error message when a limit query of an invalid type is passed", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=one")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("400: responds with an error message when a negative limit query is passed", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=-1")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
  describe("GET api/articles/:article_id/comments?limit= &p=", () => {
    it("200: responds with a limited array of comments starting from the page query", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=1")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toBe(2);

          comments.forEach((comment) => {
            expect(comment.article_id).toBe(1);
          });

          expect(comments[0].comment_id).toBe(18);
          expect(comments[1].comment_id).toBe(13);
        });
    });
    it("400: responds with an error message when query is of an invalid type", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=one")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("400: responds with an error message when query is a negative integer", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=one")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
    it("404: responds with an error message when query is valid but does not exist", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=2&p=20")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Not found");
        });
    });
    it("endpoint.json contains limit & p queries on /api/articles/:article_id/comments", () => {
      return request(app)
        .get("/api")
        .then(({ body: { endpoints } }) => {
          const topicQueries =
            endpoints["GET /api/articles/:article_id/comments"].queries;
          expect(topicQueries.includes("limit")).toBe(true);
          expect(topicQueries.includes("p")).toBe(true);
        });
    });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  it("201: responds with the inserted comment", () => {
    const postComment = {
      username: "icellusedkars",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send({ postComment })
      .expect(201)
      .then(({ body: { comment } }) => {
        const expectedComment = {
          body: "This is a comment",
          author: "icellusedkars",
          article_id: 1,
          votes: 0,
          created_at: expect.any(String),
        };

        expect(comment).toMatchObject(expectedComment);
      });
  });
  it("400: responds with error when request has an invalid username", () => {
    const postComment = {
      username: "notExistentUsername",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send({ postComment })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("400: responds with error when request is missing required information", () => {
    const postComment = {
      username: "icellusedkars",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send({ postComment })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("404: responds with an error message if id is a valid type but does not exist", () => {
    const postComment = {
      username: "icellusedkars",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/15/comments")
      .send({ postComment })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  it("400: responds with an error message if id is not a valid type", () => {
    const postComment = {
      username: "icellusedkars",
      body: "This is a comment",
    };
    return request(app)
      .post("/api/articles/notValid/comments")
      .send({ postComment })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("endpoint.json contains POST /api/articles/:article_id/comments", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty(
          "POST /api/articles/:article_id/comments"
        );
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  it("204: deletes specific comment and sends no body back", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  it("404: responds with error message when given a non-existent but valid comment id", () => {
    return request(app)
      .delete("/api/comments/20")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Comment does not exist");
      });
  });
  it("400: responds with error message when given an invalid comment id", () => {
    return request(app)
      .delete("/api/comments/comment2")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("endpoint.json contains DELETE /api/comments/:comment_id", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("DELETE /api/comments/:comment_id");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  it("200: responds with updated comment when upvoting", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/1")
      .send(vote)
      .expect(200)
      .then(({ body: { comment } }) => {
        const expectedComment = {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 17,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        };

        expect(comment).toMatchObject(expectedComment);
      });
  });
  it("200: responds with updated comment when downvoting", () => {
    const newVote = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/1")
      .send(newVote)
      .expect(200)
      .then(({ body: { comment } }) => {
        const expectedComment = {
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 15,
          author: "butter_bridge",
          article_id: 9,
          created_at: "2020-04-06T12:17:00.000Z",
        };
        expect(comment).toMatchObject(expectedComment);
      });
  });
  it("400: responds with error message if request body is invalid", () => {
    const vote = { inc_votes: "update my vote" };
    return request(app)
      .patch("/api/comments/1")
      .send(vote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("400: responds with error message if parametric endpoint is not valid", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/comment1")
      .send(vote)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("404: responds with error message if parametric endpoint is valid but does not exist", () => {
    const vote = { inc_votes: 1 };
    return request(app)
      .patch("/api/comments/21")
      .send(vote)
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  it("endpoint.json contains PATCH /api/comments/:comment_id", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("PATCH /api/comments/:comment_id");
      });
  });
});

describe("GET /api/users", () => {
  it("200: responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        const expectedUser = {
          username: expect.any(String),
          name: expect.any(String),
          avatar_url: expect.any(String),
        };

        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toMatchObject(expectedUser);
        });
      });
  });
  it("endpoint.json contains GET /api/users", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/users");
      });
  });
});

describe("GET /api/users/:username", () => {
  it("200: responds with individual user", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body: { user } }) => {
        const expectedUser = {
          username: "butter_bridge",
          name: "jonny",
          avatar_url:
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        };

        expect(user).toMatchObject(expectedUser);
      });
  });
  it("404: responds with error message if username is of valid type but doesn't exist", () => {
    return request(app)
      .get("/api/users/username")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not found");
      });
  });
  it("endpoint.json contains GET /api/users/:username", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/users/:username");
      });
  });
});

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
  it("endpoint.json contains api/topics", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("GET /api/topics");
      });
  });
});

describe("POST /api/topics", () => {
  it("201: responds with the inserted topic", () => {
    const newTopic = { slug: "topic", description: "this is a new topic" };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(201)
      .then(({ body: { topic } }) => {
        const expectedTopic = {
          slug: "topic",
          description: "this is a new topic",
        };

        expect(topic).toMatchObject(expectedTopic);
      });
  });
  it("400: responds with an error message when request body does not contain a slug key", () => {
    const newTopic = { description: "no name" };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("400: responds with an error message when slug in request body is left empty", () => {
    const newTopic = { slug: "", description: "no name" };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("400: responds with an error message when topic slug already exists", () => {
    const newTopic = { slug: "cats" };
    return request(app)
      .post("/api/topics")
      .send(newTopic)
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
  it("endpoint.json contains POST /api/topicss", () => {
    return request(app)
      .get("/api")
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toHaveProperty("POST /api/topics");
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
