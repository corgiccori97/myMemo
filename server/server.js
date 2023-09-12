const PORT = 3001;

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const app = express();

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "258080",
    database: "mymemo",
});

app.use(cors({
    origin: "*",
    credentials: true, // 응답 헤더에 acess-control-allow-credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200
}))

// POST 요청 시 값을 객체로 바꿈
app.use(express.urlencoded({ extended: true }))

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("코딩중")
})

app.post('/', (req, res) => {
    const email = req.body.email;
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);
    const query = "INSERT INTO users (email, password) VALUES (?, ?)";
    db.query(query, [email, password], (err, result) => {
        if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).send('Error processing request');
        } else {
        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
        }
    });
});

// 서버 연결 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});