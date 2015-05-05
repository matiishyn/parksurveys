// phone number → send code to user → send code to node → generate token → send token || error → auth with token
var config = require('./config.json');
var dbFile = 'db.json';

var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var twilio = require('twilio')(config.twilio.sid, config.twilio.token);
var fbTGenerator = require('firebase-token-generator');

var app = express();
var router = express.Router();
var port = process.env.PORT || config.app.port;
var db = null;
var tokenGenerator = new fbTGenerator(config.firebase.secret);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

if(fs.existsSync(dbFile)) {
  db = JSON.parse(fs.readFileSync(dbFile));
} else {
  db = {
    users: {},
    codes: {}
  };

  fs.writeFileSync(dbFile, JSON.stringify(db))
};

var generateCode = function() {
  var code = [];

  for (var i = 0; i < 4; i++) {
    code.push(Math.floor(Math.random()*11));
  };
  
  return code.join('');
}

var createUser = function(req, res) {
  var phone = req.body.phone;
  var code = generateCode();

  if(db.codes[code]) {
    code = generateCode();
  };

  twilio.sendMessage({
    to: '+' + phone,
    from: config.twilio.from,
    body: code + ' — код для О парках'
  }, function(err, responseData) {
    if (!err) {
      db.codes[code] = 'queued';
      db.users[phone] = code;

      fs.writeFile(dbFile, JSON.stringify(db));

      res.status(201).json({ status: responseData.status });
    } else {
      res.status(err.status).json({ message: err.message });
    }
  });
};

var verifyUser = function(req, res) {
  var user = {
    phone: req.body.phone,
    code: req.body.code.toString()
  };

  if(db.users[user.phone]) {
    if(db.users[user.phone] === user.code && db.codes[user.code] !== 'used') {
      var token = tokenGenerator.createToken({ uid: 'sms:' + user.phone });

      if(Object.keys(db.codes).length > 100) {
        Object.keys(db.codes).map(function(item) {
          if(db.codes[item] !== 'used') {
            delete db.codes[item];
          }
        });
      };

      db.codes[user.code] = 'used';

      fs.writeFile(dbFile, JSON.stringify(db));

      res.status(200).json({ token: token });
    } else {
      res.status(401).json({ message: "Wrong code" });
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
};

router.post('/user', createUser);
router.post('/user/verify', verifyUser);

router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

app.use('/', router);
app.listen(port);