const bcrypt = require('bcrypt');
const db = require('../config/db.config');
const crypto = require('crypto');
var jwt = require("jsonwebtoken");
const fs = require('fs');

const publicKey = fs.readFileSync('publicKey.pem', 'utf8');
const privateKey = fs.readFileSync('privateKey.pem', 'utf8');

exports.register = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
       return res.status(400).send('Name and password are required!');
     }
 
     try {
        const result = await checkDuplicateUsername(name);
        if (result.length > 0) {
            return res.status(400).send('Username already exists!');
        }
        
        const hashedPassword = bcrypt.hashSync(password, 8); 
        const query = 'INSERT INTO Users (name, password) VALUES (?, ?)';
 
        db.query(query, [name, hashedPassword], (err, result) => {
          if (err) {
            console.error('Error while registering user:', err);
            return res.status(500).send('Error while registering user');
          }
      
          res.status(201).send(`Successfully registered new user! You can now login`);
        });
     } catch (error) {
        console.error('Internal server error while registering:', error);
        res.status(500).send('Error while registering');
     }
}

function checkDuplicateUsername(name) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT name FROM Users WHERE name = ?';
        
        db.query(query, [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

exports.login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const users = await findUser(name); 
        if (users.length > 0) {
            const user = users[0]; 
            const passwordIsValid = bcrypt.compareSync(password, user.password); 
            if (passwordIsValid) {
                  const sign = crypto.createSign('SHA256');
                  sign.write(`${user}`);
                  sign.end();
                  var signature = sign.sign(privateKey, 'hex');
            
                  var token = jwt.sign({ id: user.UserID }, privateKey, {
                    algorithm: 'RS256',
                    expiresIn: 86400
                  });
                  
                    res.cookie('authToken', token, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000 
                    });

                    res.cookie('signature', signature, {
                        httpOnly: true,
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000
                    });

                    res.status(200).send({ message: 'Login successful', name: user.name, userId: user.UserID });
            } else {
                return res.status(401).send({
                    accessToken: null,
                    message: "Invalid Password!"
                  });
            }
        } else {
            return res.status(404).send("No user existing");
        }
    } catch (error) {
        console.log("Error ", error);
        res.status(500).send('Error while login');
    }
}

function findUser(name) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM Users WHERE name = ?';
        
        db.query(query, [name], (err, result) => {
            if (err) {
                return reject(err);
            }
            resolve(result);
        });
    });
}

exports.checkAuth = (req, res) => {
    if (!req.cookies) {
        return res.status(400).send('Cookies are not parsed');
    }

    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
        res.status(200).send({ valid: true, decoded });
    } catch (error) {
        res.status(401).send({ valid: false, message: 'Invalid token', error });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('authToken', {
        httpOnly: true,
        secure: true, 
        sameSite: 'None'
    });
    
    res.clearCookie('signature', {
        httpOnly: true,
        secure: true,
        sameSite: 'None'
    });

    res.status(200).send({ message: 'Logout successful' });
};