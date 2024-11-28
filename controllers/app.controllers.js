const endpointsJson = require("../endpoints.json");
const {
  readTopics,
  selectArticlesById,
  selectArticles,
  selectCommentsByArticleId,
  addComment,
  updateArticleVotes,
  deleteCommentById,
} = require("../models/app.models");

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

exports.getArticles = (req, res, next) => {
  selectArticles()
    .then((articles) => {
      res.status(200).send(articles);
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;

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

exports.patchArticlesVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (
    inc_votes === undefined ||
    typeof inc_votes !== "number" ||
    isNaN(inc_votes)
  ) {
    const err = new Error("Bad request: invalid format");
    err.status = 400;
    return next(err);
  }

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;

  const { username, body } = req.body;

  return addComment(article_id, username, body)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  console.log(comment_id);

  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
