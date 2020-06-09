// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const nodemailer = require("nodemailer");
require("dotenv").config();

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", (req, res) => {
    db.User.create({
      email: req.body.email,
      password: req.body.password
    })
      .then(() => {
        res.redirect(307, "/api/login");
      })
      .catch(err => {
        res.status(401).json(err);
      });
  });
  // Route for creating a new post from the pet post page
  app.post("/api/posts/", (req, res) => {
    console.log(req.body);
    db.Post.create({
      title: req.body.title,
      location: req.body.location,
      email: req.body.email,
      body: req.body.body,
      image: req.body.image,
      category: req.body.category,
      UserId: req.body.userId
    })
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        console.log(err);
        res.status(401).json(err);
      });
  });

  app.post("/api/email/", (req, res) => {
    // creating nodemailer transport
    const transport = nodemailer.createTransport({
      host: "smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.mail_user,
        pass: process.env.mail_pass
      }
    });
    // creating the email message
    const message = {
      from: req.body.email,
      to: req.body.email,
      subject: "New Post on Pet Finder",
      html: `<h3>Thank you for submitting your post on Pet Finder 
      helping pet owners find their lost pets since yesterday</h3>
      <h3>Post Title:</h3>
      <h4>${req.body.title}</h4>
      <h3>Post Message:</h3>
      <h4>${req.body.body}</h4>
      `
    };
    transport.sendMail(message, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  // Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  // GET route for getting all of the posts
  app.get("/api/posts/", (req, res) => {
    db.Post.findAll({}).then((data, err) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  // Get route if Lost Pet or Found Pet category are selected
  app.get("/api/posts/category/:category", (req, res) => {
    db.Post.findAll({ where: { category: req.params.category } }).then(
      (data, err) => {
        if (err) {
          console.log(err);
        } else {
          res.json(data);
        }
      }
    );
  });

  // GET route for getting all of the posts by the signed in user
  app.get("/api/posts/user", (req, res) => {
    db.Post.findAll({ where: { UserId: req.user.id } }).then((data, err) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  // Get for finding post to edit by post id
  app.get("/api/posts/:id", (req, res) => {
    db.Post.findOne({ where: { id: req.params.id } }).then((data, err) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  // Delete post by selected id
  app.delete("/api/posts/:id", (req, res) => {
    db.Post.destroy({ where: { id: req.params.id } }).then((data, err) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

  // handeling the edit of a post by the id
  app.put("/api/posts", (req, res) => {
    db.Post.update(req.body, { where: { id: req.body.id } }).then(
      (data, err) => {
        if (err) {
          console.log(err);
        } else {
          res.json(data);
        }
      }
    );
  });
};
