const {
  selectArticle,
  selectAllArticles,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    console.log(articles)
    res.status(200).send({ articles });
  });
};
