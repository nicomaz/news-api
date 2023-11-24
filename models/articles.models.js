const db = require("../db/connection");

exports.selectAllArticles = ( topic, sortBy = "created_at", order = "DESC", limit, p ) => {
  
  const queryValues = [];
  const validSortBy = [
    "author",
    "title",
    "article_id",
    "topic",
    "votes",
    "created_at",
    "article_img_url",
    "comment_count",
  ];

  const validOrder = ["ASC", "DESC"];

  if (!validSortBy.includes(sortBy) || !validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "Bad request" });
  }

  let queryString = ` 
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id)::INT AS comment_count, count(*) OVER()::INT AS total_count
      FROM articles
      FULL OUTER JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;

  queryString += ` ORDER BY ${sortBy} ${order}`;

  if (limit) {
    queryString += ` LIMIT $1`;
    queryValues.push(limit);
  } else {
    queryString += ` LIMIT 10`;
  }

  if (limit && p) {
    queryString += ` OFFSET $2`;
    queryValues.push(p * limit);
  }

  return db.query(queryString, queryValues).then(({ rows }) => {
    let totalCount = 0;
    if (rows[0]) {
      totalCount += rows[0].total_count;
    }
    rows.forEach((row) => {
      delete row.total_count;
    })
    return { rows, totalCount };
  });
};

exports.selectArticle = (articleId) => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, COUNT(comments.article_id)::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.changeArticleVotes = (articleId, votes) => {
  return db
    .query(
      `UPDATE articles
  SET votes = votes + $2
  WHERE article_id = $1
  RETURNING *`,
      [articleId, votes]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows[0];
    });
};

exports.createArticle = (article) => {
  const { author, title, body, topic, article_img_url } = article;
  const articleArray = [author, title, body, topic];

  if (!article_img_url) {
    articleArray.push(
      "https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?w=700&h=700"
    );
  } else articleArray.push(article_img_url);

  return db
    .query(
      `INSERT INTO articles
  (author, title, body, topic, article_img_url)
  VALUES 
  ($1, $2, $3, $4, $5)
  RETURNING *
  `,
      articleArray
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
