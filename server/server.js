const PORT = 3001;
const checkQuery = "SELECT * FROM users WHERE email = ?";
const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

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

// 회원가입
app.post('/join', (req, res) => {
    const email = req.body.email;
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);
    db.query(insertQuery, [email, password], (err, result) => {
        if (err) {
        console.error('Error executing MySQL query: ', err);
        // res.status(500).send('Error processing request');
        res.status(500).send(err);
        } else {
        console.log('Data inserted successfully');
        res.status(200).send('Data inserted successfully');
        }
    });
});

// 로그인
app.post('/signin', (req, res) => {
    const useremail = req.body.email;
    const userpassword = req.body.password;
    db.query(checkQuery, [useremail], (err, results) => {
        console.log(results);
        if (results.length) {
            bcrypt.compare(userpassword, results[0].password, (err, result) => {
                if (result) {
                    console.log("login successed");   
                    res.status(200).send('Login successed');
                }
                else {
                    console.log("잘못된 정보입니다..");
                    res.status(500).send(err);
                }
            })
        }
        else {
            console.log("유저 정보가 없습니다.");
            res.status(500).send(err);
        }
    })
});

// 서버 연결 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});