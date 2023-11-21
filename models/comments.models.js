const db = require("../db/connection");

exports.insertComment = (comment, articleId) => {
  const {
    postComment: { username, body },
  } = comment;
  const commentArray = [body, username, +articleId];
  return db
    .query(
      `INSERT INTO comments
        (body, author, article_id)
        VALUES
        ($1, $2, $3) 
        RETURNING *`,
      commentArray
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
