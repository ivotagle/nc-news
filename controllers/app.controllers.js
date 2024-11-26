const endpointsJson = require("../endpoints.json");
const { readTopics, selectArticlesById } = require("../models/app.models");

exports.getApi = (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
};

exports.getTopics = (req, res, next) => {
  readTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad request: invalid format" });
  }
  selectArticlesById(article_id)
    .then((article) => {
      if (!article) {
        return res.status(404).send({ msg: `Article ${article_id} not found` });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
