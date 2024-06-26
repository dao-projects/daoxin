const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public")));

app.post("/tracker", (req, res) => {
  console.log(req.body);
  // res.send(200);
  res.sendStatus(200);
});

app.listen(9000, () => {
  console.log("服务启动在9000");
});
