const express = require("express");
const fs = require("fs");

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/files', (req, res) => {
  let body = req.constructor.toString();//.body;

  body = req.body;

  console.log(body);

  res.send(body);
})

app.get("/", (req, res) => {
  const data = fs.readFileSync("./sites.json", "utf8");

  const obj = JSON.parse(data);

  console.log(JSON.stringify(obj));

  res.send(obj);
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
