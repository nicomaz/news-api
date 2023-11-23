const db = require("../db/connection");

exports.selectAllArticles = (topic, sortBy = "created_at") => {
  const queryValues = [];

  let queryString = ` 
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT (comments.article_id) AS comment_count
      FROM articles
      FULL OUTER JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
    queryString += ` WHERE articles.topic = $1`;
    queryValues.push(topic);
  }

  queryString += ` GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url`;

  queryString += ` ORDER BY ${sortBy} DESC`;

  return db.query(queryString, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticle = (articleId) => {
  return db
    .query(
      `
      SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, articles.body, COUNT(comments.article_id) AS comment_count
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

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return rows;
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
