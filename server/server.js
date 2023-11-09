const PORT = 3001;

// 세션 관련
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const mysql = require('mysql2');

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
        withCredentials:true,
        httpOnly: false,
        secure: false,
        expires: new Date().toLocaleTimeString,
        maxAge: 1000 * 60 * 60 * 24, // 1일
        samesite: 'none'
    },
}));

const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const insertQuery = "INSERT INTO users (email, password) VALUES (?, ?)";

app.set('trust proxy', 1) // trust first proxy
app.use(express.urlencoded({ extended: true })); // POST 요청 시 값을 객체로 바꿈
app.use(bodyParser.json());

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true, // 응답 헤더에 acess-control-allow-credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200
}));

// 로그인
app.post('/signin', (req, res) => {
    const useremail = req.body.email;
    const userpassword = req.body.password;
    // db에 일치하는 이메일이 있는가?
    db.query("SELECT * FROM users WHERE email = ?", [useremail], (err, results) => {
        // 일치하는 이메일이 있음
        if (results) {
            // req.body.password와 db값의 password 해시값 비교
            bcrypt.compare(userpassword, results[0].password, (err, result) => {
                // 비밀번호 일치(로그인 성공)
                if (result) {
                    req.session.userId = results[0].id;
                    req.session.save( function (err) {
                        req.session.reload( function (err) {
                            if (!err) {
                                console.log("세션 저장 성공");
                                res.send({ isSignedIn: true });
                            } else {
                                console.log(`오류: ${err}`);
                                res.status(500).send({ isSignedIn: false });
                            }
                        });
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

app.get('/', (req, res) => {
    console.log(req.session);
})

// 회원가입
app.post('/join', (req, res) => {
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

// 로그아웃
app.post('/signout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ error: 'error' });
        } else {
            res.status(200).json({ message: 'logged out' });
        }
    });
});

// 세션체크
app.post('/check-session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ sessionExists: true });
    } else {
        // 세션이 없거나 로그인되지 않은 상태
        res.json({ sessionExists: false });
    }
});

// Notebook 추가
app.post('/notebook', (req, res) => {
    const title = req.body.title;
    db.query("INSERT INTO notebooks (id, notebook_name) VALUES (?, ?)", [req.session.userId, title], (err) => {
        if (err) {
            res.status(500).send('error creating notebook');
        } else {
            db.query("SELECT notebook_id FROM notebooks WHERE notebook_name = ? AND id = ?", [title, req.session.userId], (err, result) => {
                if (!err) res.status(200).send(result);
            });
        }
    });
});

const multer = require('multer');
const upload = multer();

// Notebook => memo 추가
app.post('/add', upload.single('image'), (req, res) => {
    // console.log(req.body);
    // const notebook_id = req.body[0];
    // let content = '';
    // let imageSource = null;
    // if (req.body[1]) {
    //     content = req.body[1];
    // };
    // if (req.body[2]) {
    //     imageSource = req.body[2];
    // };
    const notebook_id = Number(req.body.notebook_id);
    const content = req.body.content;
    const imageSource = req.file ? req.file.buffer : null;
    db.query("INSERT INTO memochip (notebook_id, id, content, photo_url) VALUES (?, ?, ?, ?)", [notebook_id, req.session.userId, content, imageSource], (err, result) => {
        if (err) {
        console.log(err);
        res.status(500).send(err);
        } else {
        const chipId = result.insertId;
        res.status(200).json({chip_id: chipId});
        }
    });
});

// !노트북 데이터! 가져와서 화면에 표시
app.post('/paint', (req, res) => {
    db.query("SELECT * FROM notebooks WHERE id = ?", [req.session.userId], (err, result) => {
        if (err) {
            res.status(500).send("error selecting notebooks");
        } else {
            res.status(200).send(result);
        }
    });
});

// !메모 데이터! 가져와서 화면에 표시
app.post('/paintm', (req, res) => {
    db.query("SELECT * FROM memochip WHERE id = ? AND notebook_id = ?", [req.session.userId, req.body], (err, result) => {
        console.log(result);
        if (err) {
            res.status(500).send("error selecting memochips");
        } else {
            res.status(200).send(result);
        }
    })
});

app.post('/delete', (req, res) => {
    console.log(req.body);
    db.query("DELETE FROM memochip WHERE notebook_id = ? AND chip_id = ?", [req.body[0].id, req.body[1]], (err, result) => {
        if (!err) {
            res.status(200).send();
        } else {
            console.log(err);
            res.status(500).send(err);
        }
    });
});

app.post('/edit', (req, res) => {
    console.log(req.body);
    db.query("UPDATE memochip SET content = ?, photo_url = ? WHERE notebook_id = ? AND chip_id = ?", [req.body[0], req.body[1], req.body[2], req.body[3]], (err, result) => {
        if (!err) {
            res.status(200).send();
        } else {
            console.log(err);
            res.status(500).send(err);
        }
    });
});

// 서버 연결 
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
});