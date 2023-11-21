const { checkExists } = require("../db/seeds/utils");
const { selectCommentsByArticleId } = require("../models/comments.models");

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const articlePromises = [selectCommentsByArticleId(article_id)];

  if (article_id) {
    articlePromises.push(checkExists("articles", "article_id", article_id));
  }

  Promise.all(articlePromises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[0];
      res.status(200).send({ comments });
    })
    .catch(next);
};
