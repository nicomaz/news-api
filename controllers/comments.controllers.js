const { insertComment } = require("../models/comments.models");

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;
  insertComment(newComment, article_id).then((comment) => {
    res.status(201).send({ comment });
  });
};
