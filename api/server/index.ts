import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Routes } from "./routes/routes";
import { config } from "./constants/config";
const app = express();

dotenv.config();

app.use(bodyParser.json({ limit: config.bodyParserLimit }));
app.use(
  bodyParser.urlencoded({ limit: config.bodyParserLimit, extended: true })
);

const router = new Routes().routes();

app.use("/", router);

app.listen(8080, () => {
  console.log("Running");
});
