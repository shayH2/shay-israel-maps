const express = require("express");
const fs = require("fs");

const app = express();

app.get("/", (req, res) => {
  const data = fs.readFileSync("./sites.json", "utf8");

  const json0 = JSON.parse(data);

  console.log(JSON.stringify(json0));

  res.send(data || "Failed to read sites.json");
});

app.get("/files", (req, res) => {
  const map = new Map();

  map["directory"] = __dirname;

  map["filename"] = __filename;

  try {
    const data = fs.readdirSync(__dirname);

    map["dirfiles"] = data;
  } catch (e) {
    map["exception"] = e;
  }

  res.send(map);
});

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

// Export the Express API
module.exports = app;
