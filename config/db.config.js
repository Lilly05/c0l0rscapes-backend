//const dbConfig = require("./db.config.js");
require('dotenv').config();
const mysql = require('mysql2')

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

    const createTableUsers = `
      CREATE TABLE IF NOT EXISTS Users (
      UserID INT unsigned NOT NULL AUTO_INCREMENT, 
      name VARCHAR(150) NOT NULL,     
      password VARCHAR(150) NOT NULL,     
      PRIMARY KEY (UserID))
  `;

  db.query(createTableUsers, (err, result) => {
    if (err) {
      console.error('Fehler beim Erstellen der Tabelle Users:', err);
      return;
    }
    console.log('Tabelle "Users" erstellt oder existiert bereits.');
  });

  const createTableColors = `
    CREATE TABLE IF NOT EXISTS Colors (
    ColorID INT unsigned NOT NULL AUTO_INCREMENT, 
    color VARCHAR(150) NOT NULL,     
    guessedColor VARCHAR(150) NOT NULL,     
    accuracy INT unsigned NOT NULL,     
    UserID INT unsigned NOT NULL,
    PRIMARY KEY (ColorID),               
    FOREIGN KEY (UserID) REFERENCES Users(UserID))
`;

db.query(createTableColors, (err, result) => {
if (err) {
  console.error('Fehler beim Erstellen der Tabelle Colors:', err);
  return;
}
console.log('Tabelle "Colors" erstellt oder existiert bereits.');
});
 });

module.exports = db;