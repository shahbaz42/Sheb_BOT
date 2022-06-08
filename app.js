require("dotenv").config();
require("./api/config/DB").connect();
const express = require("express");
const morgan = require("morgan");
const router = require("./api/routes/router");

const app = express();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use("/", router);

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});