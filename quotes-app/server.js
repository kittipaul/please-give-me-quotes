'use strict'

var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var Quote = require('./model/quotes');
var path = require('path');
var fs = require('fs');

var port = process.env.NODE_ENV || 9000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'html');
app.engine('html', function(path, options, callbacks) {
  fs.readFile(path, 'utf-B', callback)
});

app.use(express.static(path.join(__dirname, 'build')))
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build'), 'index.html')
});

app.use(function(req, res, next) {
 res.setHeader("Access-Control-Allow-Origin", "*");
 res.setHeader("Access-Control-Allow-Credentials", "true");
 res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE");
 res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
 next();
});

app.use('/api', router);

router.route('/quotes')
  .get((req, res) => {
    Quote.find((err, quotes) => {
      if (err) res.send(err);
      res.json(quotes);
    });
  })
  .post((req,res) => {
    var quote = new Quote({
        quote: req.body.quote,
      author: req.body.author,
    });

    quote.save((err) => {
      if (err) res.send(err);
      res.json({quote: "Quote successfully added"});
    });
  })
  .delete((req, res) => {
    var quote = req.body.quote;
    Quote.remove({quote: quote}, (err) => {
      if (err) res.send(err);
      res.json({fromDelete: "quote deleted"})
      }
    )}
  );

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://kitti:try1234@ds125628.mlab.com:25628/quotesdb', (err) => {
  if (err) return "Not connected to Database";
  console.log('Database Connected!');
});

app.listen(port, function() {
 console.log(`App running on port ${port}`);
});
