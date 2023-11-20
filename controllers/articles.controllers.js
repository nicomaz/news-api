const { selectAllArticles } = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  selectAllArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};