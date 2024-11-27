exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Bad request: invalid format" });
  } else next(err);

  if (err.code === "22003") {
    res.status(404).send({ msg: "Bad request: Article not found" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
