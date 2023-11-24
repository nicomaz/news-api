const { checkExists } = require("../db/seeds/utils");
const {
  insertComment,
  selectCommentsByArticleId,
  removeComment,
  changeCommentVotes,
} = require("../models/comments.models");

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

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  changeCommentVotes(comment_id, inc_votes).then((comment) => {
    res.status(200).send({ comment });
  })
  .catch(next)
};
