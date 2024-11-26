const express = require("express");
const { handleServerErrors } = require("./errors/index.js");
const {
  getApi,
  getTopics,
  getArticlesById,
} = require("./controllers/app.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticlesById);

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

app.use(handleServerErrors);

module.exports = app;
