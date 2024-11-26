const express = require("express");
const { getApi, getTopics } = require("./controllers/app.controllers");

const app = express();

app.get("/api", getApi);

app.get("/api/topics", getTopics);

//Generic errors, later to be in their own file...
app.use((err, req, res, next) => {
  //console.error(err);
  res.status(500).send({ error: "Internal Server Error" });
});

app.use((req, res) => {
  res.status(404).send({ msg: "Not Found" });
});

module.exports = app;
