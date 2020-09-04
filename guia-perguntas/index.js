const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//Database
connection.authenticate().then(() => {
  console.log("Conexao com o banco de dados realizada");
}).catch((msgErro) => {
  console.log(msgErro);
});

//Estou dizendo para o express usar o ejs como redenrizador de html
app.set('view engine','ejs');
app.use(express.static('public'));

//BodyParser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/",(req, res) => {
  Pergunta.findAll({ raw: true, order:[
    ['id','DESC'] //ASC - crescente DESC - decrescente
  ] }).then(perguntas => {
    console.log(perguntas);
    res.render("index", {
      perguntas: perguntas
    });
  });
});

app.get("/perguntar",(req, res) => {
  res.render("perguntar");
});

app.post("/salvarpergunta",(req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;
  Pergunta.create({
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect("/");
  });
});

app.get("/pergunta/:id",(req,res) => {
  let id = req.params.id;
  Pergunta.findOne({ //Método do sequelize que procura um dado 
    where: {id: id}
  }).then(pergunta => {
    if(pergunta != undefined) {

      Resposta.findAll({
        where: {perguntaId: pergunta.id},
        order: [ ['id','DESC'] ]
      }).then(respostas => {
        res.render("pergunta",{
          pergunta: pergunta,
          respostas: respostas
        });
      });
    }
    else {
      res.redirect("/");
    }
  });
});

app.post("/responder", (req, res) => { 
  let corpo = req.body.corpo;
  let perguntaId = req.body.pergunta;
  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/" + perguntaId);
  });
});

app.listen(8080,() => {
  console.log("O pai tá on");
});