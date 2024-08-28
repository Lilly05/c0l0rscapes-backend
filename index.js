var express = require('express');
const game = require('./routes/game');
const user = require('./routes/user');
const cors = require('cors');
const crypto = require('crypto');
const fs = require('fs');
const cookieParser = require('cookie-parser');

var app = express();

app.use(cookieParser());
app.use(express.json());

// CORS
app.use(cors({
   origin: 'http://localhost:8080', 
   credentials: true, 
}));

// Public and private key
function generateKeyPair() {
   const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
     modulusLength: 2048,
     publicKeyEncoding: {
       type: 'spki',
       format: 'pem',
     },
     privateKeyEncoding: {
       type: 'pkcs8',
       format: 'pem',
     },
   });
 
   fs.writeFileSync('publicKey.pem', publicKey);
   fs.writeFileSync('privateKey.pem', privateKey);
 
   console.log('Key pair generated and saved.');
 }

// Routes
app.use('/api/game', game)
app.use('/api/user', user)

generateKeyPair();
app.listen(3000);



