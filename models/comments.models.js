const db = require("../db/connection");

exports.selectCommentsByArticleId = (articleId, limit, p) => {
  const queryArgs = [articleId];

  let queryStr = `SELECT * FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`;

  if (limit) {
    queryStr += ` LIMIT $2`;
    queryArgs.push(limit);
  }

  if (p) {
    queryStr += ` OFFSET $3`
    queryArgs.push(p)
  }

  return db.query(queryStr, queryArgs).then(({ rows }) => {
    return rows;
  });
};

exports.insertComment = (comment, articleId) => {
  const {
    postComment: { username, body },
  } = comment;

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
        return Promise.reject({ status: 404, msg: "Comment does not exist" });
      }
    });
};

exports.changeCommentVotes = (commentId, vote) => {
  return db
    .query(
      `UPDATE comments
    SET votes = votes + $2
    WHERE comment_id = $1
    RETURNING *`,
      [commentId, vote]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
      return rows[0];
    });
};
