const {
  selectArticle,
  selectCommentsByArticleId,
  selectAllArticles,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};