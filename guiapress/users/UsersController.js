const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/admin/users", (req, res) => {
  User.findAll().then(users => {
    res.render("admin/users/index",{users: users});
  });
});

router.get("/admin/users/create", (req, res) => {
  res.render("admin/users/create");
});

router.post("/users/create/", (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({
    where: {
      email: email
    }
  }).then( user => {

    if(user == undefined) {
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);

      User.create({
        email: email,
        password: hash
      }).then(() => {
        res.redirect("admin/users");
      }).catch(err => {
        res.redirect("admin/users");
      });
    }
    else {
      res.redirect("admin/users");
    }
  });
});

router.post("/users/delete", (req, res) => {
  let id = req.body.id;
  if(id != undefined) {
    if(!isNaN(id)) {
      User.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect("/admin/users");
      });
    }
    else {
      res.redirect("/admin/users");
    }
  }
  else {
    res.redirect("admin/users");
  }
});

router.get("/admin/users/edit/:id",(req,res) => {
  let id = req.params.id;

  if(isNaN(id)) {
    res.redirect("/admin/users");
  }
  User.findByPk(id).then(user => {
    if(user != undefined) {
      res.render("admin/users/edit",{user: user});
    }
    else {
      res.redirect("/admin/users");
    }
  }).catch(erro => {
    res.redirect("/admin/users");
  });
});

router.post("/users/update", (req,res) => {
  let id = req.body.id;
  let email = req.body.email;
  let password = req.body.password;

  User.findOne({
    where: {
      email: email,
      //[id.ne]: id
    }
  }).then(user => {
    if(user == undefined){
      let salt = bcrypt.genSaltSync(10);
      let hash = bcrypt.hashSync(password, salt);
      User.update({
        email: email,
        password: hash
      },
      {
        where: {
          id: id
        }
      });
    }
    else{
      //Devolver a página informando que o email já está cadastro
      res.render("admin/users/edit",{user: user});
    }
  });
});

router.get("/login", (req, res) => {
  res.render("admin/users/login");
});

router.post("/authenticate", (req,res) => {
  let email = req.body.email;
  let password = req.body.password;
  User.findOne({
    where: {
      email: email
    }
  }).then(user => {
    if(user != undefined){
      //validando a senha
      let correct = bcrypt.compareSync(password, user.password);
      if(correct) {
        req.session.user = {
          id: user.id,
          email: user.email
        }
        //res.json(req.session.user);
        res.redirect("/admin/articles");
      }
      else{
        res.redirect("/login");
      }
    }
    else{
      res.redirect("/login");
    }
  })
});

router.get("/logout", (req,res) => {
  req.session.user = undefined;
  res.redirect("/login");
});

module.exports = router;