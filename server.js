// Declare our dependencies
const express = require('express');
const request = require('superagent');
const http = require('http');

require('dotenv').config()

const backendHost = process.env.BACK_HOST || 'localhost';
const app = express();

// Set the view engine to use EJS as well as set the default views directory
app.set('view engine', 'ejs');
app.set('views', __dirname + '/public/views/');

// This tells Express out of which directory to serve static assets like CSS and images
app.use(express.static(__dirname + '/public'));

// The homepage route of our application does not interface with the MovieAnalyst API and is always accessible. We won’t use the getAccessToken middleware here. We’ll simply render the index.ejs view.
app.get('/', function (req, res) {
  res.render('index');
})

// For the movies route, we’ll call the getAccessToken middleware to ensure we have an access token. If we do have a valid access_token, we’ll make a request with the superagent library and we’ll be sure to add our access_token in an Authorization header before making the request to our API.
// Once the request is sent out, our API will validate that the access_token has the right scope to request the /movies resource and if it does, will return the movie data. We’ll take this movie data, and pass it alongside our movies.ejs template for rendering
app.get('/movies', function (req, res) {
  request
    .get(backendHost + '/movies')
    .end(function (err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var movies = data.body;
        res.render('movies', { movies: movies });
      }
    })
})

// The process will be the same for the remaining routes. We’ll make sure to get the acess_token first and then make the request to our API to get the data.
// The key difference on the authors route, is that for our client, we’re naming the route /authors, but our API endpoint is /reviewers. Our route on the client does not have to match the API endpoint route.
app.get('/authors', function (req, res) {
  request
    .get(backendHost + '/reviewers')
    .set('Authorization', 'Bearer ' + req.access_token)
    .end(function (err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var authors = data.body;
        res.render('authors', { authors: authors });
      }
    })
})

app.get('/publications', function (req, res) {
  request
    .get(backendHost + '/publications')
    .end(function (err, data) {
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var publications = data.body;
        res.render('publications', { publications: publications });
      }
    })
})

app.get('/backEnd', function (req, res) {
  request
    .get(backendHost + '/ip')
    .end(function (err, data) {
      console.log(data.body)
      if (data.status == 403) {
        res.send(403, '403 Forbidden');
      } else {
        var ips = data.body;
        res.render('backEnd', { ips: ips });
      }
    })
})


app.get('/frontEnd', function (req, res) {
  request
    .get('http://169.254.169.254/latest/meta-data/local-hostname')
    .end(function (err, data) {
      if (err) {
        let ips = err.message;
        res.render('frontEnd', { ips: ips });
      } else {
        let ips = data.text;
        res.render('frontEnd', { ips: ips });
      }
    })
})

app.listen(3030);
