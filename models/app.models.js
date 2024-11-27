const db = require("../db/connection");

exports.readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = () => {
  const text = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments comments ON articles.article_id = comments.article_id
  GROUP BY articles.article_id
  ORDER BY articles.created_at DESC `;

  return db.query(text).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (article_id) => {
  const text = `SELECT * FROM articles WHERE article_id = $1`;
  const values = [article_id];
  return db.query(text, values).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectCommentsByArticleId = (article_id) => {
  const text = `SELECT article_id, comment_id, votes, author, created_at, body FROM comments WHERE article_id = $1 ORDER BY created_at DESC`;
  const values = [article_id];

  return db.query(text, values).then(({ rows }) => {
    return rows;
  });
};

exports.addComment = (article_id, username, body) => {
  const text = `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING comment_id, article_id, author, body, created_at;`;

  const values = [article_id, username, body];

  return db
    .query(text, values)
    .then(({ rows }) => {
      //console.log(rows, "<=rows");
      return rows;
    })
    .catch((err) => {
      console.log(err, "<=this err");
    });
};
