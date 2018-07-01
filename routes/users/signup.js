const express = require('express');
const router = express.Router();
const crypto = require('crypto-promise');		// crypto 모듈의 promise 버전
const db = require('../../module/pool.js');

//회원가입
router.post('/', async function(req, res){
  let user_id = req.body.user_id;
  let user_pw = req.body.user_pw;

  if(!user_id || !user_pw){
    res.status(400).send({
      message : "Null Value"
    });
  }

  else {
    let checkUserQuery = 'SELECT * FROM user WHERE user_id = ?';
    let resultChecking = await db.queryParam_Arr(checkUserQuery, [user_id]);

    if(!resultChecking){ //쿼리 수행 중 에러 발생시 500
      res.status(500).send({
        message : "Internal Server Error1"
      });
    }
    else if(resultChecking.length == 1){  //이미 존재하는 유저 정보 입력시 400
      res.status(400).send({
        message : "Already Exist"
      });
    }
    else { //정상 수행
      //salt를 생성, 값을 할당 받아 user_pw를 암호화
      const salt = await crypto.randomBytes(32);
      const hashedpw = await crypto.pbkdf2(user_pw, salt.toString('base64'), 100000, 32, 'sha512');

      let insertUserQuery = 'INSERT INTO user (user_id, user_pw, user_salt) VALUES (?, ?, ?)';
      let resultInserting = await db.queryParam_Arr(insertUserQuery, [user_id, hashedpw.toString('base64'), salt.toString('base64')]);

      if(!insertUserQuery){ //쿼리 수행 중 에러 발생시 500
        res.status(500).send({
          message : "Internal Server Error2"
        });
      }

      else {
        res.status(201).send({
          message : "Successfully Sign Up"
        });
      }
    }
  }
});


module.exports = router;
