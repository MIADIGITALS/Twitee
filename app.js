const express = require('express');
const mongoose = require('mongoose');
const Twit = require('./models/twit');
const { Nodemailing } = require('nodemailing');
const bodyParser = require("body-parser");
const http = require("http");
require ('dotenv').config();

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = `${process.env.MONGO_URI}`;

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/signup');
});

app.get('/signup', (req, res) => {
  res.render('signup', {title: 'Signup' })
})

app.post('/signup', function(req,res){
    var name = req.body.name;
    var username = req.body.username;
    var email =req.body.email;
    var pass = req.body.password;
    var phone =req.body.phone;
  
    var data = {
        "name": name,
        "username": username,
        "email":email,
        "password":pass,
        "phone":phone
    }
    console.log("Record inserted Successfully");
    return res.redirect('mytwits/create');
})
  

// twit routes
app.get('/mytwits', (req, res) => {
  res.render('mytwits', { title: 'My twits' });
});

app.get('/mytwits/create', (req, res) => {
  res.render('create', { title: 'Create a new twit' });
});

app.get('/edittwits', (req, res) => {
  res.render('edit', { title: 'Edit your twit'})
});

app.get('/alltwits', (req, res) => {
  Twit.find({}).sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { twits: result, title: 'All twits' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/mytwits', (req, res) => {
  // console.log(req.body);
  const twit = new Twit(req.body);

  twit.save()
    .then(result => {
      res.redirect('/alltwits');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/alltwits/:id', (req, res) => {
  const id = req.params.id;
  Twit.findById(id)
    .then(result => {
      res.render('details', {twit: result, title: 'Alltwit Details'});
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/alltwits/:id', (req, res) => {
  const id = req.params.id;
  Twit.findByIdAndDelete(id)
    .then(result => {
      res.json({redirect: '/alltwits' })
    })
    .catch(err =>{
      console.log(err)
    })
})

app.put("/alltwits/:id", (req, res) => {
  const requestedId = req.params.id;
  console.log(req.body);
  Twit.findOneAndUpdate(id)
    .then(result => {
      res.json({redirect: '/edittwits' })
      twit.save()
      .then(result => {
        res.redirect('/alltwits');
      })
    })
    .catch(err =>{
      console.log(err)
    })
});

app.get("/edittwits", (req, res) => {
  res.render('edit', { twits: result, title: 'Edit twits' });
});

Nodemailing.send({
  Host: '',
  Username: 'flexit',
  Password: 1234,
  To: `$email`,
  From: 'michaeladigwe29@gmail.com' ,
  Subject: 'Welcome to Twitee',
  Body: 'Flexit welcomes you to to Twitee (The next big social app)',
})
.then((message) =>
//anything goes here....  it returns **OK** by default
    console.log("Email has been sent")
)
.catch(error => {
// who knows, an error might just occur
  console.log(error)
});


mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    console.log('Connected to mongo db.')
    app.listen(3000);
    console.log('Server listening to port 3000');
  })
  .catch(err =>{
    console.log(err)
  })


  
  
// app.listen('3000')
// console.log('server listening to port 3000')



