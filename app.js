const express = require("express");
const { handleServerErrors, handleCustomErrors } = require("./errors/index.js");
const {
  getApi,
  getTopics,
  getArticles,
  getArticlesById,
  getCommentsByArticleId,
  postComment,
  patchArticlesVotes,
  deleteComment,
} = require("./controllers/app.controllers");

const app = express();

app.use(express.json());

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticlesById);

app.patch("/api/articles/:article_id", patchArticlesVotes);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
