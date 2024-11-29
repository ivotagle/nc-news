const db = require("../db/connection");

exports.readTopics = () => {
  return db.query(`SELECT * FROM topics;`).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validColumns = [
    "article_id",
    "title",
    "author",
    "created_at",
    "topic",
    "votes",
  ];
  const validOrder = ["asc", "desc"];

  if (!validColumns.includes(sort_by) || !validOrder.includes(order)) {
    throw new Error("Invalid sort or order");
  }

  let text = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments comments ON articles.article_id = comments.article_id  `;
  //4 hours to realise WHERE have to be here
  //GROUP BY articles.article_id
  //ORDER BY ${sort_by} ${order} ;

  const values = [];

  if (topic) {
    text += ` WHERE articles.topic = $1`;
    values.push(topic);
  }

  text += ` GROUP BY articles.article_id`;

  text += ` ORDER BY ${sort_by} ${order}`;

  return db
    .query(text, values)
    .then(({ rows }) => {
      return rows;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

exports.selectArticlesById = (article_id) => {
  const text = `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, 
  CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id`;

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

exports.updateArticleVotes = (article_id, inc_votes) => {
  const newVote = `UPDATE articles
  SET votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`;
  const values = [inc_votes, article_id];

  return db
    .query(newVote, values)
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      throw err;
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

exports.deleteCommentById = (comment_id) => {
  if (isNaN(comment_id)) {
    return Promise.reject(new Error("Bad request: invalid format"));
  }
  const text = `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`;
  const values = [comment_id];

  return db
    .query(text, values)
    .then(({ rows }) => {
      if (rows.length === 0) {
        return null;
      }
      return rows[0];
    })
    .catch((err) => {
      throw err;
    });
};

exports.selectAllUsers = () => {
  return db
    .query(`SELECT username, name, avatar_url FROM users;`)
    .then(({ rows }) => {
      return rows;
    });
};
