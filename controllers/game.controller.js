const db = require('../config/db.config');

exports.getRandomColor = (req, res) => {
    res.status(200).send([Math.floor(Math.random()*(256)), Math.floor(Math.random()*(256)), Math.floor(Math.random()*(256))]);
}

exports.saveColorGuess = (req, res) => {
    const { color, inputColor, accuracy, userID } = req.body;

    if (!color || !inputColor || !accuracy || !userID) {
      return res.status(400).send('Color, guessed Color, accuracy and UserID required!');
    }
  
    const query = 'INSERT INTO Colors (color, guessedColor, accuracy, UserID) VALUES (?, ?, ?, ?)';
  
    db.query(query, [color, inputColor, accuracy, userID], (err, result) => {
      if (err) {
        console.error('Error while inserting colors:', err);
        return res.status(500).send(err.message);
      }
  
      res.status(201).send(`Colors added with following ID: ${result.insertId}`);
    });
}

exports.getHistory = (req, res) => {
    const userId = req.params.userId;

    const query = 'SELECT * FROM Colors WHERE UserID = ?';
 
    db.query(query, [userId], (err, result) => {
       if (err) {
          console.error('Error while fetching data ', err);
          return res.status(500).send('Error while fetching data');
       }
       res.json(result);
    });
} 