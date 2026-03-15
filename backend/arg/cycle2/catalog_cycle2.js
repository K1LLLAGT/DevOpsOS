const fs = require("fs");
const path = require("path");

module.exports = (req, res) => {
  const { url } = req.body;

  res.json({
    added: url,
    message: "Recursion catalog linked. The catalog references itself."
  });
};
