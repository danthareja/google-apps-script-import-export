var colors = require('colors');
var OAuth2Client = require('googleapis').auth.OAuth2;
var ServiceToken = require('googleapis').auth.JWT;

var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs'));

var defaults = require('./defaults');

module.exports = function authenticate() {
  return getCredentials()
    .then(createAuthClient)
    .catch(function(err) {
      console.log('Error in authenticate module', err);
    });
};

function getCredentials() {
  if (process.env.GOOGLE_APPS_PRIVATE_KEY) {
    const buffer = Buffer.from(process.env.GOOGLE_APPS_PRIVATE_KEY, 'base64').toString();
    const json = JSON.parse(buffer);
    json.serviceAccount = true;
    return Promise.resolve(json);
  }
  return fs.readFileAsync(defaults.STORAGE_FILE)
    .then(JSON.parse)
    .catch(SyntaxError, function(e) {
      console.log('Could not parse credentials'.red);
    })
    .error(function(e) {
      console.log('Could not read path to credentials file. Please check your path and try again'.red);
      throw err;
    });
}

function createAuthClient(credentials) {
  if (credentials.serviceAccount == true) {
    var auth = new ServiceToken(
      credentials.client_email,
      null,  // 'path/to/key.pem',

      // Contents of private_key.pem if you want to load the pem file yourself
      // (do not use the path parameter above if using this param)
      credentials.private_key,

      // Scopes can be specified either as an array or as a single, space-delimited string
      // ['https://spreadsheets.google.com/feeds'], // TODO: check if this is correct
      [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/drive.file',
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.apps.readonly',
      ],

      // User to impersonate (leave empty if no impersonation needed)
      null
    );

    return Promise.promisify(auth.authorize.bind(auth))()
      .then(function(res) {
        return auth;
      })
  }

  var auth = new OAuth2Client(
    credentials.client_id,
    credentials.client_secret,
    credentials.redirect_uri
  );

  // refreshAccessToken requires refresh_token to be set
  auth.credentials.refresh_token = credentials.refresh_token;
  return new Promise(function(resolve, reject) {
    auth.refreshAccessToken(function(err, tokens) {
      if (err) return reject(err);
      auth.setCredentials(tokens);
      resolve(auth);
    });
  });
}
