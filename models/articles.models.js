const db = require("../db/connection");

exports.selectArticle = (articleId) => {
  return db
    .query(
      `
      SELECT * FROM articles 
      WHERE article_id = $1`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
