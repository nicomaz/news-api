
const { checkExists } = require("../db/seeds/utils");
const {
  insertComment,
  selectCommentsByArticleId,
  removeComment,
} = require("../models/comments.models");

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  const { article_id } = req.params;

  const articlePromises = [
    checkExists("articles", "article_id", article_id),
    insertComment(newComment, article_id),
  ];

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const comment = resolvedPromises[1];
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articlePromises = [
    selectCommentsByArticleId(article_id),
    checkExists("articles", "article_id", article_id),
  ];

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
