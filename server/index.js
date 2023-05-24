const express = require('express');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: '',
    password: '',
    database: '',
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            db.query(
                'INSERT INTO users (username, password) VALUES (?, ?)',
                [username, hash],
                (error, result) => {
                    if (error) {
                        console.log(error);
                        res.sendStatus(500);
                    } else {
                        console.log('User registered:', username);
                        res.sendStatus(201);
                    }
                }
            );
        }
    });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.query(
        'SELECT * FROM users WHERE username = ?',
        [username],
        (error, results) => {
            if (error) {
                console.log(error);
                res.sendStatus(500);
            } else if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({ username }, 'Secret', {
                            expiresIn: '1h',
                        });
                        console.log('User logged in:', username);
                        res.json({ token });
                    } else {
                        res.sendStatus(401);
                    }
                });
            } else {
                res.sendStatus(401);
            }
        }
    );
});

app.listen(5000, () => {
    console.log('Server is running on port 5000');
});