const express = require("express");
const fs = require("fs");
const sites = require('./sites');

const version = "1.0.0.0";

const app = express();

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true }))

// Parse JSON bodies (as sent by API clients)
app.use(express.json());

app.post('/files', (req, res) => {
  let body = req.constructor.toString(); //.body;

  body = req.body;

  console.log(body);

  res.send(body);
});

app.delete('/files/:name', (req, res) => {
  const name = req.params.name;

  let data = name;

  try {
    if (fs.existsSync(name))
      fs.unlinkSync(name);
  } catch (e) {
    data = e;
  }

  console.log(data);

  res.send(data);
});

const validPrefix = "a-zA-Z_";
const validExtension = validPrefix;
const validCharacters = "a-zA-Z_";

const regex1 = new RegExp(`^[${validPrefix}]+[${validCharacters}]*$`);
const regex2 = new RegExp(`^[${validPrefix}]+[${validCharacters}]*\.${validExtension}$`);

app.get('/sites', (req, res) => {
  res.send(sites);
});

app.put('/files/:name', (req, res) => {
  try {
    let name = req.params.name;

    let t = regex1.test(name);

    if (t === false)
      return res.status(500).send(`invalid input ${name}`);

    console.log(`${name}, ${regex1}, ${t}`);

    t = regex2.test(name);

    // Add .json extension to filename, by default.
    if (t === false)
      name = `${name}.json`;

    console.log(`${name}, ${regex2}, ${t}`);

    console.log(`open file: ${name}`);

    let fd = fs.openSync(name, "a+");

    console.log(`read file descriptor: ${fd}`);

    const str = fs.readFileSync(fd);

    console.log(`str = ${str}`);

    console.log(`close file descriptor: ${fd}`);

    fs.closeSync(fd);

    fd = fs.openSync(name, "w");

    //console.log(`req.body = ${JSON.stringify(req.body)}`);

    let jsn;

    if (str.length > 0)
      jsn = JSON.parse(str);

    jsn = jsn || [];

    jsn.push(req.body);

    fs.writeFileSync(fd, JSON.stringify(jsn));

    fs.closeSync(fd);

    //console.log(jsn);
  } catch (e) {
    return res.status(500).send(e);
  }

  res.send(jsn);
})

app.get("/methods", (req, res) => { });

app.get("/", (req, res) => {
  const data = fs.readFileSync("./sites.json", "utf8");

  const obj = JSON.parse(data);

  console.log(JSON.stringify(obj));

  res.send(obj);
});

app.get("/files", (req, res) => {
  const map = new Map();

  map["version"] = version;

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