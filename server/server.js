const PORT = 3001;
const checkQuery = "SELECT * FROM users WHERE email = ?";
const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const session = require('express-session');
const { useNavigate } = require('react-router');
const FileStore = require('session-file-store')(session);

const app = express();

app.use(session({
    secret: "mmmo",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 6 * 60 * 10000,
        secure: true,
        },
    store: new FileStore(),
}));

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
    const sendData = { isJoin: "" };
    const email = req.body.email;
    let password = req.body.password;
    password = bcrypt.hashSync(password, 10);
    db.query(insertQuery, [email, password], (err, result) => {
        if (err) {
        console.error('Error executing MySQL query: ', err);
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
    const sendData = { isSignedIn: "" };
    
    db.query(checkQuery, [useremail], (err, results) => {
        console.log(results);
        if (results.length) {
            // req.body.password와 db값의 password 해시값 비교
            bcrypt.compare(userpassword, results[0].password, (err, result) => {
                // 로그인 성공한 경우
                if (result) {
                    req.session.isSignedIn = "True";
                    req.session.save(() => {
                        sendData.isSignedIn = "True";
                        res.status(200).send(sendData);
                    })
                }
                // 로그인 실패
                else {
                    sendData.isSignedIn = "Wrong";
                    res.status(500).send(sendData);
                }
            })
        }
        // 유저 정보 없음
        else {
            sendData.isSignedIn = "Wrong";
            res.status(500).send(sendData);
        }
    })
});

// 로그아웃
app.get('/signout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send("<h1>500 error</h1>");
        }
        res.redirect("/");
    });
});

// 서버 연결 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});