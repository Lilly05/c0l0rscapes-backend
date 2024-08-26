var express = require('express');
var app = express();

app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

app.get('/color', function(req, res){
   res.send(randomColor());
});

function randomColor() {
   return [Math.floor(Math.random()*(256)), Math.floor(Math.random()*(256)), Math.floor(Math.random()*(256))];
}

app.listen(3000);