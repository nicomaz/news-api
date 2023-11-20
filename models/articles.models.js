const db = require("../db/connection");

exports.selectAllArticles = () => {
  return db
    .query(
      ` 
    SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles
    FULL OUTER JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url;
    `
    )
    .then(({ rows }) => {
      return rows;
    });
};
