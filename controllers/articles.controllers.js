const {
  selectArticle,
  selectCommentsByArticleId,
  selectAllArticles,
  changeArticleVotes,
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

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.updateArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticleVotes(article_id, inc_votes).then((article) => {
    res.status(200).send({ article });
  });
};
