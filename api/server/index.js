const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const app = express();

app.use(bodyParser.json({ limit: "150mb" }));
app.use(bodyParser.urlencoded({ limit: "150mb", extended: true }));

app.use("/", routes());

app.listen("8080");
