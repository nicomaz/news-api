const db = require("../db/connection");

exports.selectCommentsByArticleId = (articleId) => {
  return db
    .query(
      `SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC`,
      [articleId]
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.insertComment = (comment, articleId) => {
  const { postComment: { username, body } } = comment;
  const commentArray = [body, username, articleId];
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


exports.removeComment = (articleId) => {
  return db
    .query(
      `DELETE FROM comments 
       WHERE comment_id = $1
       RETURNING *`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({status: 404, msg: "Comment does not exist"})
      }
    });
};
