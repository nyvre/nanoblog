//[0]+-/ Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var https = require('https')

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'nanoblogo',
  masterKey: process.env.MASTER_KEY || 'X6zaywgWgM8UOsyE2CF5f4WbRdHRA5Em', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:8080/parse',  // Don't forget to change to https if needed
  restApiKey: process.env.REST_API || 'restApiKey',

  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();
app.use(express.static(path.join(__dirname, '/public/assets/css')))
// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/js', express.static(path.join(__dirname, '/public/js/')));
app.use('/css', express.static(path.join(__dirname, '/public/css/')));
app.use('/img', express.static(path.join(__dirname, '/public/img/')));
// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get(/api\/*/, function(req, res) {
  var parsePath = '/parse' + req.originalUrl.substring(4);
  if (req.originalUrl.substring(0, 4) === '/api') {
    if (req.originalUrl.length <= 5) {
      console.log("here");
       res.sendFile(path.join(__dirname, '/public/api.html'));
    } else {
      const options = {
        hostname: 'nanoblogo.herokuapp.com',
        port: 443,
        method: 'GET',
        path: parsePath,
        headers: {
        'X-Parse-Application-Id': 'nanoblogo',
        'X-Parse-REST-API-Key': 'restApiKey',
        json: true
        },
      } 
      var req = https.request(options, function(response) {
        response.setEncoding('utf8');
        var allData = ''
        response.on('data', function (data) {
          allData += data
        });
        response.on('end', function () {
          res.status(200).json(JSON.parse(allData));
        })
      });

      req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
      });
      req.end();
    }
  } else {
    res.status(400).send('Bad API request');
  }

});

var port = process.env.PORT || 8080;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);
