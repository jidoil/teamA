const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cookieParser = require("cookie-parser");
const fs = require("fs")
const auth = require("./routes/auth");
const mypages = require("./routes/mypage");
const board = require("./routes/board")
const port = 3001;
const cors = require("cors");
const authController = require('./controllers/auth');

app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/auth', auth);
app.use("/mypage",/* authController.isLoggedIn, */ mypages); //개발 작업중이므로 필수인증 임시대기
app.use('/board', board)

const data = fs.readFileSync("./database.json");
const conf = JSON.parse(data);
const connection = mysql.createConnection({
  host: conf.host,
  user: conf.user,
  password: conf.password,
  port: conf.port,
  database: conf.database
});

connection.connect((err) => {                           
  if(err) throw err;
  console.log("MySQL Conected!!!");
});

app.get('/', authController.isLoggedIn, (req, res) => {
  res.send({
    user: req.user
  });
});

// app.get('/mypage', authController.isLoggedIn, (req, res) => {
//   console.log(req.user);
//   if( req.user ) {
//     res.send({
//       user: req.user
//     });
//   } else {
//     res.redirect('/login');
//   }
  
// })

// app.get("/auth/logout", authcontroller.logout, (req, res) => {

// });


app.get("/api/products", (req, res) => {
    connection.query(
      "SELECT * FROM Products",
      (err, rows, fields) => {
        res.send(rows);
      }
    )
});


app.get("/api/boards", (req, res) => {
    connection.query(
      "SELECT * FROM Boards",
      (err, rows, fields) => {
        res.send(rows);
      }
    )
});

app.post("/board/write", (req, res)=>{
  var buserid = req.body.buserid;
  var btitle = req.body.btitle;
  var bcontent = req.body.bcontent;
  var datas = [buserid, btitle, bcontent];
    let sQuery = "insert into Boards(buserid, btitle, bcontent, regdate, modidate, bhit, blikeuser) values(?,?,?,now(),now(),0,0)";  // ? 는 매개변수
        connection.query(sQuery, datas,(err, result, fields) => {
          res.send(result)
        });
})


app.put("/api/boards", (req,res) => {
  var bidx = req.body.bidx;
  var btitle = req.body.btitle;
  var bcontent = req.body.bcontent;
  let sQuery = `UPDATE Boards SET btitle=("${btitle}"), bcontent=("${bcontent}"), modidate=now() where bidx=${bidx}`;  // ? 는 매개변수
  connection.query(sQuery, (err, result, fields) => {
    res.send(result)
  })
})

app.delete("/api/boards", (req, res) => {
  var bidx = parseInt(req.query.bidx);
  connection.query(
    `DELETE from Boards where bidx=${bidx}`
  )
})

app.put("/board/hit", (req,res) => {
  var bidx = req.body.bidx;
  let sQuery = `UPDATE Boards SET bhit=bhit+1 where bidx=${bidx}`;
  connection.query(sQuery, (err, result, fields) => {
    res.send(result)
  })
})


app.get("/api/comments", (req, res) => {
  connection.query(
    `SELECT * FROM Comments`,
    (err, rows, fields) => {
      res.send(rows);
    }
  )
});

app.post("/api/comments", (req, res) => {
  var idx = req.body.board_idx;
  var cuserid = req.body.cuserid;
  var ccontent = req.body.ccontent;
    connection.query(
      `INSERT INTO Comments(cuserid, ccontent, board_idx) values('${cuserid}','${ccontent}','${idx}')`,
      (err, rows, fields) => {
        res.send(rows);
      }
    )
});

app.delete("/api/comments", (req, res) => {
  var cidx = parseInt(req.query.cidx);
  console.log(cidx)
  connection.query(
    `DELETE from Comments where cidx=${cidx}`
  )
})

app.listen(port, () => console.log(`Listening on port ${port}`));
