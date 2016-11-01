var express = require('express');
var app = express();
var path = require("path");
require('dotenv').config();

app.use(express.static('public'));

app.get('/test', function (req, res) {
  res.sendFile(path.join(__dirname+'/public/maptest.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
