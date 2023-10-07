const PORT = 3001;

// 세션 관련
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');
let hour = 360000;

const app = module.exports = express();

const options = ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "258080",
    database: "mymemo",
});

const db = mysql.createPool(options);
const sessionStore = new MySQLStore({}, db);

// 세션
app.use(session({
    secret: "mymemo",
    resave: true,
    saveUninitialized: false,
    clearExpired: true,
    store: sessionStore,
    cookie: { 
        httpOnly: false,
        secure: false,
        // expires: new Date(Date.now() + hour),
        expires: new Date().toLocaleTimeString,
        maxAge: 1000 * 60 * 60 * 24, // 1일
    },
}));

const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const checkQuery = "SELECT * FROM users WHERE email = ?";
const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

app.set('trust proxy', 1) // trust first proxy
app.use(express.urlencoded({ extended: true })); // POST 요청 시 값을 객체로 바꿈
app.use(bodyParser.json());
// app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // 응답 헤더에 acess-control-allow-credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200
}));

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
    // db에 일치하는 이메일이 있는가?
    db.query(checkQuery, [useremail], (err, results) => {
        // 일치하는 이메일이 있음
        if (results) {
            // req.body.password와 db값의 password 해시값 비교
            bcrypt.compare(userpassword, results[0].password, (err, result) => {
                // 비밀번호 일치(로그인 성공)
                if (result) {
                    req.session.isSignedIn = true;
                    req.session.email = useremail;
                    req.session.save((err) => {
                        if (!err) {
                            console.log(`세션 저장 성공햇슴요 ㅋㅋ`);
                            res.send({ isSignedIn: true });
                        } else {
                            console.log(`세션 저장 과정에서 오류:${err}`);
                            res.status(500).send({ isSignedIn: false });
                        }
                        console.log(req.session);
                    });
                }
                // 비밀번호 불일치
                else {
                    res.status(500).send({ isSignedIn: false });
                }
            })
        }
        // 일치하는 이메일이 없음
        else {
            res.status(500).send({ isSignedIn: "Wrong" });
        }
    })
});

// 로그아웃
app.get('/signout', (req, res) => {
    req.session.destroy().then(() => {
        console.log("logged out");
    })
    .catch(err => {
        console.log(err);
    })
});

// 세션체크
app.get('/check-session', (req, res) => {
    console.log(req.sessionID);
    if (!req.session || !req.session.isSignedIn) {
        // 세션이 없거나 로그인되지 않은 상태
        res.json({ sessionExists: false });
        res.status(401).send(); 
    } else {
        // 세션이 존재하고 로그인된 상태
        res.json({ sessionExists: true });
        res.status(200).send();
    }
});

// memo 추가
app.post('/add', (req, res) => {
    const content = req.body[0].content;
    const imageSource = req.body[1].split("localhost:3000/")[1];
    const dataInsertQuery = "INSERT INTO memochip (content, photo_url) VALUES (?, ?)";
    db.query(dataInsertQuery, [content, imageSource], (err, result) => {
        if (err) {
        console.error('Error executing MySQL query: ', err);
        res.status(500).send(err);
        } else {
        console.log('Data inserted successfully');
        res.status(200).send();
        }
    });
});

// 데이터 가져와서 화면에 표시
app.get('/paint', (req, res) => {
    const findQuery = "SELECT * FROM memochip WHERE user_id= ?";
    db.query(findQuery, [req.session.email], (err, result) => {
        console.log(`paint 함수: ${result}`);
    })
})

// 서버 연결 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});