const { checkExists } = require("../db/seeds/utils");
const {
  selectArticle,
  selectAllArticles,
  changeArticleVotes,
  createArticle,
} = require("../models/articles.models");

exports.getArticles = (req, res, next) => {
  const { topic, sort_by, order } = req.query;
  const topicPromises = [selectAllArticles(topic, sort_by, order)];

  if (topic) {
    topicPromises.push(checkExists("topics", "slug", topic));
  }

  Promise.all(topicPromises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  changeArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.postArticle = (req, res, next) => {
  const article = req.body;
  createArticle(article)
  .then((article) => {
    const articleId = article.article_id
    return selectArticle(articleId)
  })
  .then((article) => {
    res.status(201).send({article})
  })
};
