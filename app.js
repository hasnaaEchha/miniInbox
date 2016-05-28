var express = require('express');
var app = express();
var morgan = require('morgan');             
var bodyParser = require('body-parser');    
var methodOverride = require('method-override');

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');


app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());




/// / If modifying these scopes, delete your previously saved credentials
        // at ~/.credentials/gmail-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/gmail.send', 'https://www.googleapis.com/auth/contacts.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'gmail-nodejs-quickstart.json';
var clientSecret,clientId, redirectUrl, auth, oauth2Client, gmail;
app.get('/google/getCode', function(req, res) {
  console.log('get');
  // Load client secrets from a local file.
  fs.readFile('client_secret.json', function processClientSecrets(err, content) {
    if (err) {
      console.log('Error loading client secret file: ' + err);

      return;
    }
    // Authorize a client with the loaded credentials, then call the
    // Gmail API.
    clientSecret = JSON.parse(content).web.client_secret;
    clientId = JSON.parse(content).web.client_id;
    redirectUrl = JSON.parse(content).web.redirect_uris[0];
    auth = new googleAuth();
    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, function(err, token) {
      
          var authUrl = oauth2Client.generateAuthUrl({
          access_type: 'offline',
          scope: SCOPES
        });
      res.send(authUrl);   
    });

  });


  // use mongoose to get all todos in the database
  //res.send('get accepted');
});

app.get('/google/getToken',function(req,res){  
  code=req.param('code');
  console.log(code);
  oauth2Client.getToken(code, function(err, token) {
    if (err) {
      console.log('Error while trying to retrieve access token', err);
      return;
    }
    oauth2Client.credentials = token;
    console.log(token);

    res.send(token);
    listLabels(oauth2Client);
  });
})

app.get('*', function(req, res) {
        res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

    // create todo and send back all todos after creation
app.post('/google/send', function(req, res) {
    console.log(req.body.message);
    var email_lines = [];

    email_lines.push("From: \"Some Name Here\" <me>");
    email_lines.push("To: hasnaa.ech@gmail.com");
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push("Subject: New future subject here");
    email_lines.push("");
    email_lines.push("And the body text goes here");
    email_lines.push("<b>And the bold text goes here</b>");

    var email =email_lines.join("\r\n").trim();

    var base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');
    gmail.users.messages.send({
      auth: oauth2Client,
      userId: "me",
      resource: 
      {
           raw: base64EncodedEmail
      }           
    })
    res.send('post accepted');
});






    // delete a todo
    app.delete('/api/todos/:todo_id', function(req, res) {
        console.log('delete request');
        res.send('delete accepted');
    });

    
    

app.listen(3000, function () {
  console.log('Tech app listening on port 3000!');
});




/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
     return getNewToken(oauth2Client, callback);
    } else {
        console.log('error');
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  console.log('getNewToken');
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
  return authUrl;
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  console.log('storeToken');
  try {
    fs.mkdirSync("tokens");
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile("tocken.json", JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
        console.log('listLabels');
  gmail = google.gmail('v1');
  gmail.users.labels.list({
    auth: auth,
    userId: 'me'
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var labels = response.labels;
    if (labels.length == 0) {
      console.log('No labels found.');
    } else {
      console.log('Labels:');
      for (var i = 0; i < labels.length; i++) {
        var label = labels[i];
        console.log('- %s', label.name);
      }
    }
  });
}


