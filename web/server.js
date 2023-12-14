import express from "express";
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { queryParser } = require("express-query-parser");
const axios = require("axios");

const app = express();
app.set("view engine", "pug");
app.use(compression());
app.use("/css", express.static("public/css"));
app.use("/initialChart.js", express.static("src/initialChart.js"));
app.use(
  "/images",
  (_req, res, next) => {
    //cache images for 1 hour so you're not asking for the same image every refresh
    res.setHeader("Cache-Control", "public, max-age=3600");
    next();
  },
  express.static("public/images"),
);
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
  res.render("index");
});

app.get("/update", async (_req, res) => {
  // const proc = Bun.spawn(["bash", "-c", "cat temp.csv | tail -n +2"], {
  //   cwd: "./",
  // });
  const proc = Bun.spawn(
    ["bash", "-c", "cat ../python/csv/temp.csv | tail -n +2"],
    {
      cwd: "./",
    },
  );

  const text = await new Response(proc.stdout).text();
  let data = text.split("\r\n");
  data = data.filter((value) => value !== "");
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
