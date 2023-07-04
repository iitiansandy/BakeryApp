const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
// const chalk = require('chalk');
const app = express();
const route = require("./src/routes/routes");
const { mongoDbUrl, port } = require('./src/middlewares/config');
const cors = require('cors');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors());


mongoose
  .connect(
    mongoDbUrl,
    { useNewUrlParser: true }
  )
  .then(() => console.log("Connected with Database"))
  .catch((err) => console.log(err));

app.use("/", route);

app.get("/", (req, res) => {
  res.send("<h1>Bakery backend deployed successfully</h1>");
});

app.listen( port, () =>
  console.log("Server is up and running")
);
