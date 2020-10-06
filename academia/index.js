const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados!");
  })
  .catch((err) => {
    console.log(err);
  }); 

app.set('view engine','ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/agendar", (req,res) => {
  res.render("agendar");
});





app.listen(3000, () => {
  console.log("Server on");
});