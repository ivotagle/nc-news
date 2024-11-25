const express = require("express");
const { getApi } = require("./controllers/app.controllers");

const app = express();

app.get("/api", getApi);

module.exports = app;
