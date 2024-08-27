var express = require('express');
var app = express();

// Database
require('dotenv').config();
const mysql = require('mysql2')

app.use(express.json());

const db = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_NAME
 });
 db.connect((err) => {
   if (err) {
     console.error('Error connecting to MySQL: ' + err.stack);
     return;
   }
   console.log('Connected to MySQL as ID ' + db.threadId);
 });

app.listen(3000);

// CORS
app.use((req, res, next) => {
   res.header("Access-Control-Allow-Origin", "*");
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
});

// API 
app.get('/color', function(req, res){
   res.send(randomColor());
});

function randomColor() {
   return [Math.floor(Math.random()*(256)), Math.floor(Math.random()*(256)), Math.floor(Math.random()*(256))];
}

app.post('/saveGuess', function(req, res) {
   const { color, inputColor, accuracy, userID } = req.body;

   if (!color || !inputColor || !accuracy || !userID) {
     return res.status(400).send('Color, guessed Color, accuracy and UserID required!');
   }
 
   const query = 'INSERT INTO Colors (color, guessedColor, accuracy, UserID) VALUES (?, ?, ?, ?)';
 
   db.query(query, [color, inputColor, accuracy, userID], (err, result) => {
     if (err) {
       console.error('Error while inserting colors:', err);
       return res.status(500).send('Error while saving colors');
     }
 
     res.status(201).send(`Colors added with following ID: ${result.insertId}`);
   });
});

app.get('/history/:userId', function(req, res) {
   const userId = req.params.userId;

   const query = 'SELECT * FROM Colors WHERE UserID = ?';

   db.query(query, [userId], (err, result) => {
      if (err) {
         console.error('Error while fetching data ', err);
         return res.status(500).send('Errir while fetching data');
      }

      res.json(result);
   });
});