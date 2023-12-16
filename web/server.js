import express from "express";
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { queryParser } = require("express-query-parser");
const axios = require("axios");

let minX = -1;
let maxX = -1;

const app = express();
app.set("view engine", "pug");
app.use(compression());
app.use("/css", express.static("public/css"));
app.use("/js", express.static("public/js"));
app.use("/img", express.static("public/img"));
app.use("/initialChart.js", express.static("src/initialChart.js"));
app.use(bodyParser.urlencoded({ extended: false })); // parse form post requests
app.use(cookieParser()); // parse cookies from requests
app.use(
  queryParser({
    parseNull: true,
    parseUndefined: true,
    parseBoolean: true,
    parseNumber: true,
  }),
); // parse query from requests

app.use("/csv", express.static("python/csv"));

app.get("/", (_req, res) => {
  minX = -1;
  maxX = -1;
  res.render("index");
});

app.get("/files", async (_req, res) => {
  const proc = Bun.spawn(["bash", "-c", "ls python/csv"], {
    cwd: "./",
  });
  const text = await new Response(proc.stdout).text();
  res.render("files", { files: text.split("\n").slice(0, -1) });
});

app.get("/resetscales", (_req, res) => {
  minX = -1;
  maxX = -1;
  res.sendStatus(200);
});

app.get("/scales", (req, res) => {
  minX = Math.round(req.query.minX);
  maxX = Math.round(req.query.maxX);
  res.sendStatus(200);
});

app.get("/view/:file", async (req, res) => {
  const file = req.params.file;
  const proc = Bun.spawn(
    ["bash", "-c", `cp python/csv/${file} python/csv/temp.csv`],
    {
      cwd: "./",
    },
  );
  res.setHeader("HX-Trigger", "getchart").sendStatus(200);
});

app.get("/update", async (_req, res) => {
  const proc = Bun.spawn(
    ["bash", "-c", "cat python/csv/temp.csv | tail -n +2"],
    {
      cwd: "./",
    },
  );

  const text = await new Response(proc.stdout).text();
  let data = text.split("\r\n");
  data = data.filter((value) => value !== "");

  // if (minX != -1 && maxX != -1) {
  //   data = data.filter((value, index) => index + 2 > minX && index - 2 < maxX);
  // }

  // decimate some data for performance
  // const downsampleLimit = 100;
  // if (data.length > downsampleLimit) {
  //   const downsampledArray = [];
  //   const factor = Math.floor(data.length / downsampleLimit);
  //   for (let i = 0; i < data.length; i += factor) {
  //     downsampledArray.push(data[i]);
  //   }
  //   data = downsampledArray;
  // }

  data = data.map((value) => value.split(","));

  const data_time = data.map((value) => value[0]);
  const data_power = data.map((value) => value[1]);
  const data_temperature = data.map((value) => value[2]);
  const data_setpoint = data.map((value) => value[3]);

  res.render("chartupdate", {
    data: {
      time: data_time,
      temperature: data_temperature,
      power: data_power,
      setpoint: data_setpoint,
    },
  });
});

app.listen(process.env.PORT || 3000);
console.log(`listening on port ${process.env.PORT || 3000} 👍`);
