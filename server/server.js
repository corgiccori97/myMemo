const PORT = 3001;
const checkQuery = "SELECT * FROM users WHERE email = ?";
const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const mysql = require('mysql2');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();
let hour = 360000;

// 세션
app.use(session({
    secret: "mmmo",
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: "/",
        secure: false,
        expires: new Date(Date.now() + hour),
        sameSite: false,
        },
    clearExpired: true,
    store: new FileStore(),
}));

const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "258080",
    database: "mymemo",
});

app.set('trust proxy', 1)

app.use(cors({
    origin: "*",
    credentials: true, // 응답 헤더에 acess-control-allow-credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200
}))

// POST 요청 시 값을 객체로 바꿈
app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("다울었니? 이제할일을하자..")
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
    // db에 일치하는 이메일이 있는가?
    db.query(checkQuery, [useremail], (err, results) => {
        // 일치하는 이메일이 있음
        if (results) {
            // req.body.password와 db값의 password 해시값 비교
            bcrypt.compare(userpassword, results[0].password, (err, result) => {
                // 비밀번호 일치(로그인 성공)
                if (result) {
                    req.session.isSignedIn = true;
                    req.session.save((err) => {
                        if (!err) {
                            console.log(`세션 저장 성공햇슴요 ㅋㅋ`);
                            sendData.isSignedIn = true;
                            res.status(200).send(sendData);
                        } else {
                            console.log(`세션 저장 과정에서 오류:${err}`);
                            sendData.isSignedIn = false;
                            res.status(500).send(sendData);
                        }
                    });
                }
                // 비밀번호 불일치
                else {
                    sendData.isSignedIn = false;
                    res.status(500).send(sendData);
                }
                console.log(`로그인 후 세션 체크:${req.session}, ${req.session.isSignedIn}, ${req.session.__lastAccess}, ${req.session.cookie.path}, ${req.session.cookie}`);
                console.log(req.session);
            })
        }
        // 일치하는 이메일이 없음
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

// 세션체크
app.get('/check-session', (req, res) => {
    console.log(`세션 있는지 체크:${req.session}, ${req.session.isSignedIn}, ${req.session.__lastAccess}, ${req.session.cookie.path}, ${req.session.cookie}`);
    console.log(req.session);
    if (req.session && req.session.isSignedIn === true) {
        res.json({ sessionExists: true });
        res.status(200).send();
    } 
    else {
        res.json({ sessionExists: false });
        res.status(500).send();
    }
});

// 서버 연결 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});